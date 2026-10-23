import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/jogo")({
  head: () => ({
    meta: [
      { title: "Jogar · Click Seeker Heróis" },
      { name: "description", content: "Derrote monstros e contrate heróis. Seu progresso fica salvo na sua conta." },
      { property: "og:title", content: "Jogar · Click Seeker Heróis" },
      { property: "og:description", content: "Derrote monstros e contrate heróis com progresso salvo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Jogo,
});

function Jogo() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const frame = useRef<HTMLIFrameElement>(null);
  const ultimo = useRef<string>("");
  const [status, setStatus] = useState("Carregando…");

  useEffect(() => {
    const salvo = supabase
      .from("game_saves")
      .select("estado")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => data?.estado ?? null);

    const onMsg = async (ev: MessageEvent) => {
      if (ev.origin !== window.location.origin || ev.source !== frame.current?.contentWindow) return;
      const d = ev.data;
      if (d?.tipo === "cs-pronto") {
        const estado = await salvo;
        ultimo.current = JSON.stringify(estado);
        frame.current?.contentWindow?.postMessage({ tipo: "cs-carregar", estado }, window.location.origin);
        setStatus("Progresso salvo na nuvem");
      } else if (d?.tipo === "cs-salvar") {
        const json = JSON.stringify(d.estado);
        if (json === ultimo.current && !d.avisar) return;
        ultimo.current = json;
        const { error } = await supabase.from("game_saves").upsert({
          user_id: user.id,
          estado: d.estado as Json,
          updated_at: new Date().toISOString(),
        });
        setStatus(error ? "Erro ao salvar" : `Salvo às ${new Date().toLocaleTimeString("pt-BR")}`);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [user.id]);

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 text-sm">
        <span className="truncate text-muted-foreground">{user.email} · {status}</span>
        <button onClick={sair} className="rounded-md border border-border px-3 py-1 font-pixel hover:bg-accent">
          Sair
        </button>
      </div>
      <iframe ref={frame} src="/game/index.html" title="Click Seeker Heróis" className="w-full flex-1 border-0" />
    </div>
  );
}
