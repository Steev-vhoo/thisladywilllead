import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, UserRound } from "lucide-react";
import { MOTTO, VISION, PILLARS } from "@/lib/site";
import founderPortrait from "@/assets/founder-portrait.jpg";
import { FounderLetter } from "@/components/FounderLetter";
import { Reveal, Stagger, StaggerItem } from "@/components/Reveal";
import { mediaUrl, useTeam } from "@/lib/media";

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

function About() {
  const { data: team = [] } = useTeam();
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
            {team.map((m) => {
              // The founder's portrait ships with the site until one is uploaded.
              const photo = m.photo_path ? mediaUrl(m.photo_path) : m.group_name === "Founder" ? founderPortrait : null;
              return (
                <li key={m.id} className="rounded-2xl border bg-background p-5 text-center">
                  {photo ? (
                    <img src={photo} alt={m.full_name} loading="lazy" className="mx-auto h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-royal text-gold">
                      <UserRound className="h-9 w-9" />
                    </div>
                  )}
                  <p className="mt-4 font-display text-lg font-bold text-primary">{m.full_name}</p>
                  <p className="eyebrow mt-1 text-gold">{m.role}</p>
                  {m.bio && <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>}
                </li>
              );
            })}
            <li className="rounded-2xl border border-dashed bg-background p-5 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold-soft text-primary">
                <HeartHandshake className="h-9 w-9" />
              </div>
              <p className="mt-4 font-display text-lg font-bold text-primary">Become a mentor</p>
              <Link to="/volunteer" className="eyebrow mt-1 inline-block text-gold hover:underline">Serve with us</Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
