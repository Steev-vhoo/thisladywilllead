import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgramCards } from "@/components/ProgramCards";
import { EventsList } from "@/components/EventsList";
import { StoriesGrid } from "@/components/StoriesGrid";
import { DonationWidget } from "@/components/DonationWidget";
import { HeroCarousel, HeroTagline } from "@/components/Hero";
import { FounderLetter } from "@/components/FounderLetter";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { PILLARS, VISION } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "This Lady Will — She Dreams. She Dares. She Does." },
      { name: "description", content: VISION },
      { property: "og:title", content: "This Lady Will — She Dreams. She Dares. She Does." },
      { property: "og:description", content: "Faith-rooted mentorship and leadership for young women growing into their God-given calling." },
    ],
  }),
  component: Index,
});

function Section({ eyebrow, title, children, action }: { eyebrow: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="mt-2 text-4xl font-bold text-primary sm:text-5xl">{title}</h2>
        </div>
        {action}
      </Reveal>
      {children}
    </section>
  );
}

function Index() {
  return (
    <>
      <section className="relative overflow-hidden bg-royal text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <HeroTagline />
            <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
              Becoming confident. Becoming whole. Becoming <em className="text-gold">all she's called to be.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-primary-foreground/85">{VISION}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full bg-gold px-8 text-base font-bold text-gold-foreground shadow-gold hover:bg-gold/90">
                <Link to="/apply">Join the Cohort <ArrowRight className="ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 text-base font-bold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/donate">Donate (MoMo)</Link>
              </Button>
            </div>
          </Reveal>
          <HeroCarousel />
        </div>
      </section>

      <Section eyebrow="Pillars of impact" title="Community. Truth. Boldness.">
        <Stagger className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.name} className="rounded-3xl border-l-4 border-gold bg-card p-6">
              <h3 className="text-2xl font-bold text-primary">{p.name}</h3>
              <p className="mt-2 text-muted-foreground">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-6 text-center text-muted-foreground">…alongside leadership, mentorship and career clarity.</Reveal>
      </Section>

      <FounderLetter />

      <Section eyebrow="Programs" title="Three tracks. One calling.">
        <ProgramCards />
      </Section>

      <div className="bg-secondary/50">
        <Section eyebrow="Events" title="Upcoming gatherings" action={<Button asChild variant="outline" className="rounded-full"><Link to="/events">All events</Link></Button>}>
          <EventsList limit={4} />
        </Section>
      </div>

      <Section eyebrow="Impact" title="Stories of fellows" action={<Button asChild variant="outline" className="rounded-full"><Link to="/stories">All stories</Link></Button>}>
        <StoriesGrid limit={3} />
      </Section>

      <section className="bg-royal">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <Reveal className="text-primary-foreground">
            <p className="eyebrow text-gold">Partner with us</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Invest in a woman who will lead.</h2>
            <p className="mt-5 text-lg text-primary-foreground/85">Give with MTN MoMo, Telecel Cash, AT Money or card.</p>
          </Reveal>
          <Reveal><DonationWidget /></Reveal>
        </div>
      </section>
    </>
  );
}
