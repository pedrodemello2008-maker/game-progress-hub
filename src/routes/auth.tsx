import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar · Click Seeker Heróis" },
      { name: "description", content: "Entre ou crie sua conta para salvar o progresso no Click Seeker Heróis." },
      { property: "og:title", content: "Entrar · Click Seeker Heróis" },
      { property: "og:description", content: "Entre para salvar seu progresso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setMsg("");
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) setMsg("E-mail ou senha incorretos.");
      else navigate({ to: "/jogo" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: { emailRedirectTo: window.location.origin + "/jogo" },
      });
      setMsg(error ? error.message : "Conta criada! Confirme pelo link enviado ao seu e-mail.");
    }
    setCarregando(false);
  }

  async function social(p: "google" | "lovable") {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (r.error) return setMsg("Não foi possível entrar.");
    if (r.redirected) return;
    navigate({ to: "/jogo" });
  }

  const campo = "w-full rounded-md border border-input bg-secondary px-3 py-2 outline-none focus:ring-2 focus:ring-ring";
  const btn2 = "w-full rounded-md border border-border py-2 font-pixel hover:bg-accent";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
        <h1 className="text-center text-4xl text-primary">Click Seeker</h1>
        <p className="mb-6 text-center text-muted-foreground">
          {modo === "entrar" ? "Entre para continuar sua aventura" : "Crie sua conta de herói"}
        </p>
        <form onSubmit={enviar} className="space-y-3">
          <input className={campo} type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={campo} type="password" required minLength={6} placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button disabled={carregando} className="w-full rounded-md bg-primary py-2 font-pixel text-lg text-primary-foreground hover:opacity-90 disabled:opacity-50">
            {modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
        </form>
        {msg && <p className="mt-3 text-center text-sm text-primary">{msg}</p>}
        <div className="my-4 text-center text-xs text-muted-foreground">ou</div>
        <div className="space-y-2">
          <button onClick={() => social("google")} className={btn2}>Continuar com Google</button>
          <button onClick={() => social("lovable")} className={btn2}>Continuar com Lovable</button>
        </div>
        <button onClick={() => setModo(modo === "entrar" ? "criar" : "entrar")} className="mt-5 w-full text-sm text-muted-foreground underline">
          {modo === "entrar" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
        </button>
      </div>
    </main>
  );
}
