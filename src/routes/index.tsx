import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Click Seeker Heróis — jogo de clique" },
      { name: "description", content: "Clique, derrote monstros e contrate heróis. Crie sua conta e salve seu progresso." },
      { property: "og:title", content: "Click Seeker Heróis" },
      { property: "og:description", content: "Clique, derrote monstros e contrate heróis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-6xl text-primary sm:text-7xl">Click Seeker</h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Derrote monstros, contrate heróis e avance pelas zonas. Seu progresso fica salvo na sua conta.
      </p>
      <Link to="/jogo" className="rounded-md bg-primary px-8 py-3 font-pixel text-xl text-primary-foreground hover:opacity-90">
        Jogar
      </Link>
    </main>
  );
}
