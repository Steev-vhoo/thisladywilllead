import { createFileRoute } from "@tanstack/react-router";
import { DonationWidget } from "@/components/DonationWidget";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate with Mobile Money | This Lady Will" },
      { name: "description", content: "Support a Sister's Mentorship (GHS 150/mo) or become a Cohort Sponsor (GHS 1,000)." },
      { property: "og:title", content: "Donate | This Lady Will" },
      { property: "og:description", content: "Give securely with MTN, Telecel, AT Mobile Money or card." },
    ],
  }),
  component: () => (
    <section className="bg-royal">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-20">
        <p className="eyebrow text-center text-gold">Partner / Donate</p>
        <h1 className="mt-2 mb-8 text-center text-4xl font-black text-primary-foreground sm:text-5xl">Invest in her leadership</h1>
        <DonationWidget />
      </div>
    </section>
  ),
});
