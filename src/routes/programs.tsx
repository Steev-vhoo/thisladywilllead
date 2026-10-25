import { createFileRoute } from "@tanstack/react-router";
import { ProgramCards } from "@/components/ProgramCards";
import { PageIntro } from "@/components/PageIntro";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs | This Lady Will" },
      { name: "description", content: "Mentorship Circles, Leadership Academy and Career Clarity — apply now." },
      { property: "og:title", content: "Programs | This Lady Will" },
      { property: "og:description", content: "Three tracks for young women growing into their calling." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Programs" title="Choose your track" />
      <ProgramCards />
    </section>
  ),
});
