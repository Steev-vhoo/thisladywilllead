import { createFileRoute } from "@tanstack/react-router";
import { ProgramCards } from "@/components/ProgramCards";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs | This Lady Will" },
      { name: "description", content: "Mentorship Circles, Leadership Academy and Career Clarity — apply now." },
      { property: "og:title", content: "Programs | This Lady Will" },
      { property: "og:description", content: "Three tracks for young women becoming leaders." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <p className="eyebrow text-gold">Programs</p>
      <h1 className="mt-2 mb-10 text-5xl font-black text-primary">Choose your track</h1>
      <ProgramCards />
    </section>
  ),
});
