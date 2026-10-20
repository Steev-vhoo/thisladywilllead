import { createFileRoute } from "@tanstack/react-router";
import { StoriesGrid } from "@/components/StoriesGrid";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Impact Stories & Blog | This Lady Will" },
      { name: "description", content: "Testimonials and articles from This Lady Will fellows." },
      { property: "og:title", content: "Impact Stories | This Lady Will" },
      { property: "og:description", content: "Stories from our cohort fellows." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <p className="eyebrow text-gold">Impact</p>
      <h1 className="mt-2 mb-10 text-5xl font-black text-primary">Stories & blog</h1>
      <StoriesGrid />
    </section>
  ),
});
