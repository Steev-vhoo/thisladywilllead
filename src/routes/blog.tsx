import { createFileRoute } from "@tanstack/react-router";
import { BlogList } from "@/components/StoriesGrid";
import { PageIntro } from "@/components/PageIntro";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog & Insights | This Lady Will" },
      { name: "description", content: "Articles on leadership, faith, emotional wholeness and professional excellence." },
      { property: "og:title", content: "Blog & Insights | This Lady Will" },
      { property: "og:description", content: "Insights for young women leading with faith and boldness." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Blog & news" title="Insights for the journey" />
      <BlogList />
    </section>
  ),
});
