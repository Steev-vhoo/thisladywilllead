import { createFileRoute } from "@tanstack/react-router";
import { AuthPanel } from "@/components/AuthPanel";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Member & Mentor Login | This Lady Will" },
      { name: "description", content: "Sign in to the This Lady Will member area with a password or magic link." },
      { property: "og:title", content: "Login | This Lady Will" },
      { property: "og:description", content: "Access your cohort resources, schedules and community." },
    ],
  }),
  component: AuthPanel,
});
