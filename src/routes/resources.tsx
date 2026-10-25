import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PageIntro } from "@/components/PageIntro";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resource Library | This Lady Will" },
      { name: "description", content: "Free PDF guides and toolkits: Calling & Career Workbook, Mentee Preparedness Guide, Prayer & Leadership Habit Tracker." },
      { property: "og:title", content: "Resource Library | This Lady Will" },
      { property: "og:description", content: "Downloadable guides for young women leaders." },
    ],
  }),
  component: Resources,
});

const RESOURCES = [
  { title: "The Calling & Career Workbook", type: "Workbook", file: "/resources/calling-career-workbook.pdf", blurb: "Discover your gifts and map career pathways aligned with your calling." },
  { title: "Mentee Preparedness Guide", type: "Guide", file: "/resources/mentee-preparedness-guide.pdf", blurb: "Get the most out of your mentorship journey from day one." },
  { title: "Prayer & Leadership Habit Tracker", type: "Toolkit", file: "/resources/prayer-leadership-habit-tracker.pdf", blurb: "Track the daily rhythms that build whole, bold leaders." },
];

function Resources() {
  const [type, setType] = useState("All");
  const [gate, setGate] = useState<(typeof RESOURCES)[number] | null>(null);
  const [email, setEmail] = useState("");
  const shown = RESOURCES.filter((r) => type === "All" || r.type === type);

  async function sendGate(e: React.FormEvent) {
    e.preventDefault();
    const p = z.string().trim().email().max(255).safeParse(email);
    if (!p.success || !gate) { toast.error("Enter a valid email"); return; }
    const { error } = await supabase.from("resource_leads").insert({ email: p.data, resource: gate.title });
    if (error) { toast.error("Could not save. Try again."); return; }
    window.open(gate.file, "_blank");
    toast.success("Enjoy your guide! We'll send more resources your way.");
    setGate(null); setEmail("");
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Resources" title="Resource library">Free guides and toolkits to help you grow in your calling.</PageIntro>
      <div className="mb-8 flex gap-2 overflow-x-auto">
        {["All", "Workbook", "Guide", "Toolkit"].map((t) => (
          <button key={t} onClick={() => setType(t)} aria-pressed={type === t}
            className={cn("shrink-0 rounded-full border-2 px-4 py-2 font-label text-sm font-semibold", type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{t}</button>
        ))}
      </div>
      <Stagger className="grid gap-5 md:grid-cols-3">
        {shown.map((r) => (
          <StaggerItem key={r.title} className="flex flex-col rounded-3xl border bg-card p-6">
            <FileText className="h-10 w-10 text-gold" />
            <span className="eyebrow mt-4 text-muted-foreground">{r.type} · PDF</span>
            <h3 className="mt-1 text-xl font-bold">{r.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{r.blurb}</p>
            <div className="mt-5 flex flex-col gap-2">
              <Button asChild className="rounded-xl"><a href={r.file} download><Download className="mr-1 h-4 w-4" />Download</a></Button>
              <Button variant="outline" className="rounded-xl" onClick={() => setGate(r)}><Mail className="mr-1 h-4 w-4" />Email me this guide</Button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <Dialog open={!!gate} onOpenChange={(o) => !o && setGate(null)}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl">
          <DialogTitle className="font-display text-2xl">Get {gate?.title}</DialogTitle>
          <DialogDescription>Enter your email to unlock the guide and receive future resources.</DialogDescription>
          <form onSubmit={sendGate} className="space-y-3">
            <Input type="email" aria-label="Email" placeholder="you@email.com" className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" className="h-12 w-full rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">Unlock download</Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
