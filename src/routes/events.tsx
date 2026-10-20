import { createFileRoute } from "@tanstack/react-router";
import { EventsList } from "@/components/EventsList";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & X Spaces | This Lady Will" },
      { name: "description", content: "Upcoming workshops and X Spaces. RSVP to save your seat." },
      { property: "og:title", content: "Events | This Lady Will" },
      { property: "og:description", content: "Workshops and X Spaces for young women leaders." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <p className="eyebrow text-gold">Events</p>
      <h1 className="mt-2 mb-8 text-5xl font-black text-primary">Upcoming events</h1>
      <EventsList />
    </section>
  ),
});
