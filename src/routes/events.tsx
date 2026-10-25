import { createFileRoute } from "@tanstack/react-router";
import { EventsList } from "@/components/EventsList";
import { PageIntro } from "@/components/PageIntro";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | This Lady Will" },
      { name: "description", content: "Sisterhood circles, mentorship roundtables and faith & work workshops. Register to save your seat." },
      { property: "og:title", content: "Events | This Lady Will" },
      { property: "og:description", content: "Gatherings for young women leaders in Accra and online." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Events" title="Upcoming events" />
      <EventsList />
    </section>
  ),
});
