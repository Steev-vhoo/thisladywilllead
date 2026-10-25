import { createFileRoute } from "@tanstack/react-router";
import { ShareStoryButton, StoriesGrid } from "@/components/StoriesGrid";
import { PageIntro } from "@/components/PageIntro";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Impact & Stories | This Lady Will" },
      { name: "description", content: "Testimonials from fellows on spiritual growth, confidence and career milestones." },
      { property: "og:title", content: "Impact & Stories | This Lady Will" },
      { property: "og:description", content: "Stories of young women growing into their God-given calling." },
    ],
  }),
  component: () => (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Impact" title="Stories of transformation">
        <p>Fellows from past cohorts share how they grew in faith, confidence and career.</p>
        <div className="mt-6"><ShareStoryButton /></div>
      </PageIntro>
      <StoriesGrid />
    </section>
  ),
});
