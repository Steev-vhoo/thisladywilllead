import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { MOTTO, VISION, PILLARS } from "@/lib/site";
import { FounderLetter } from "@/components/FounderLetter";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Leadership | This Lady Will" },
      { name: "description", content: "Our founder's vision and the mentors leading This Lady Will." },
      { property: "og:title", content: "About & Leadership | This Lady Will" },
      { property: "og:description", content: "Mentorship and leadership empowerment for young women becoming leaders." },
    ],
  }),
  component: About,
});

const SPOTLIGHT = ["Founder", "Mentor", "Mentor", "Mentor", "Mentor", "Mentor"];

function About() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <Reveal>
          <p className="eyebrow text-gold">About us</p>
          <h1 className="mt-2 text-5xl font-black text-primary sm:text-6xl">{MOTTO}</h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">{VISION}</p>
        </Reveal>
        <Stagger className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map((p) => (
            <StaggerItem key={p.name} className="rounded-3xl border-l-4 border-gold bg-card p-6">
              <h2 className="text-2xl font-bold text-primary">{p.name}</h2>
              <p className="mt-2 text-muted-foreground">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <FounderLetter />
      <section>
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
          <p className="eyebrow text-gold">Leadership</p>
          <h2 className="mt-2 text-4xl font-bold text-primary">Team & mentor spotlight</h2>
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
            {SPOTLIGHT.map((role, i) => (
              <li key={i} className="rounded-2xl border bg-background p-5 text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-royal text-gold">
                  <UserRound className="h-9 w-9" />
                </div>
                <p className="mt-4 font-display text-lg font-bold">Profile coming soon</p>
                <p className="eyebrow mt-1 text-muted-foreground">{role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
