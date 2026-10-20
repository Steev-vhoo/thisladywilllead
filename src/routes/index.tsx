import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import founder from "@/assets/founder.jpg";
import { Button } from "@/components/ui/button";
import { ProgramCards } from "@/components/ProgramCards";
import { EventsList } from "@/components/EventsList";
import { StoriesGrid } from "@/components/StoriesGrid";
import { DonationWidget } from "@/components/DonationWidget";
import { MOTTO } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "This Lady Will — She Dreams. She Dares. She Does." },
      { name: "description", content: "Mentorship and leadership empowerment for young women becoming leaders. Join the cohort or partner with us." },
      { property: "og:title", content: "This Lady Will — She Dreams. She Dares. She Does." },
      { property: "og:description", content: "Mentorship and leadership empowerment for young women becoming leaders." },
    ],
  }),
  component: Index,
});

function Section({ eyebrow, title, children, action }: { eyebrow: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="mt-2 text-4xl font-bold text-primary sm:text-5xl">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Index() {
  return (
    <>
      <section className="relative overflow-hidden bg-royal text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1.5 text-gold">
              <Sparkles className="h-3.5 w-3.5" /> {MOTTO}
            </p>
            <h1 className="mt-6 text-5xl font-black leading-[1.02] sm:text-6xl lg:text-7xl">
              Her time to lead is <em className="text-gold">now.</em>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-primary-foreground/85">
              Mentorship and leadership empowerment for young women becoming leaders.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full bg-gold px-8 text-base font-bold text-gold-foreground shadow-gold hover:bg-gold/90">
                <Link to="/apply">Join the Cohort <ArrowRight className="ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-2 border-primary-foreground/40 bg-transparent px-8 text-base font-bold text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <Link to="/donate">Partner / Donate</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <img src={hero1} alt="Young woman leader smiling" width={768} height={1024} className="row-span-2 h-full w-full rounded-3xl object-cover" />
            <img src={hero2} alt="Young women in a mentorship circle" width={1024} height={768} className="aspect-[4/3] w-full rounded-3xl object-cover" />
            <img src={hero3} alt="Young woman speaking at a podium" width={768} height={1024} className="aspect-[4/3] w-full rounded-3xl object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="bg-card">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[2fr_3fr]">
          <img src={founder} alt="Founder of This Lady Will" width={768} height={960} loading="lazy" className="aspect-[4/5] w-full max-w-sm rounded-3xl object-cover shadow-royal" />
          <div>
            <p className="eyebrow text-gold">Founder's vision</p>
            <h2 className="mt-2 text-4xl font-bold text-primary sm:text-5xl">She dreams. She dares. She does.</h2>
            <p className="mt-6 text-lg text-muted-foreground">
              This Lady Will exists to mentor and empower young women as they become leaders — through mentorship, leadership development and career clarity, in a community that celebrates every step.
            </p>
            <Button asChild variant="link" className="mt-4 px-0 text-base text-primary">
              <Link to="/about">Meet our leadership <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Section eyebrow="Programs" title="Three tracks. One movement.">
        <ProgramCards />
      </Section>

      <div className="bg-secondary/50">
        <Section eyebrow="Events" title="Upcoming gatherings" action={<Button asChild variant="outline" className="rounded-full"><Link to="/events">All events</Link></Button>}>
          <EventsList limit={4} />
        </Section>
      </div>

      <Section eyebrow="Impact" title="Stories of fellows" action={<Button asChild variant="outline" className="rounded-full"><Link to="/stories">All stories</Link></Button>}>
        <StoriesGrid limit={4} />
      </Section>

      <section className="bg-royal">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <div className="text-primary-foreground">
            <p className="eyebrow text-gold">Partner with us</p>
            <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Invest in a woman who will lead.</h2>
            <p className="mt-5 text-lg text-primary-foreground/85">Give securely with Mobile Money (MTN, Telecel, AT) or card.</p>
          </div>
          <DonationWidget />
        </div>
      </section>
    </>
  );
}
