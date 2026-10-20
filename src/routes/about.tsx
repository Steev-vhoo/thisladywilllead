import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import founder from "@/assets/founder.jpg";
import { MOTTO } from "@/lib/site";

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
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="eyebrow text-gold">About us</p>
          <h1 className="mt-2 text-5xl font-black text-primary sm:text-6xl">{MOTTO}</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            This Lady Will is an NGO dedicated to mentorship and leadership empowerment for young women becoming leaders.
          </p>
        </div>
        <img src={founder} alt="Founder of This Lady Will" width={768} height={960} className="aspect-[4/5] w-full max-w-md justify-self-center rounded-3xl object-cover shadow-royal" />
      </section>
      <section className="bg-card">
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
