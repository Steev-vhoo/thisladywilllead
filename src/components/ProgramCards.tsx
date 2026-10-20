import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PROGRAMS } from "@/lib/site";
import { Button } from "@/components/ui/button";

export function ProgramCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {PROGRAMS.map((p) => (
        <article key={p.slug} className="flex flex-col rounded-3xl border bg-card p-6 transition hover:shadow-royal">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-royal text-gold">
            <p.icon className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-2xl font-bold">{p.name}</h3>
          <p className="mt-3 flex-1 text-muted-foreground">{p.blurb}</p>
          <Button asChild className="mt-6 h-12 rounded-xl">
            <Link to="/apply" search={{ track: p.slug }}>Apply Now <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
