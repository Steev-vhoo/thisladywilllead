import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer | This Lady Will" },
      { name: "description", content: "Serve as a Mentor / Life Coach, Event Coordinator, Content & Social Media or Administrative Support volunteer." },
      { property: "og:title", content: "Volunteer | This Lady Will" },
      { property: "og:description", content: "Walk with young women as they grow into their calling." },
    ],
  }),
  component: Volunteer,
});

const TRACKS = ["Mentor / Life Coach", "Event Coordinator", "Content & Social Media", "Administrative Support"];
const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20),
  track: z.string().min(1, "Choose a volunteer track"),
  experience: z.string().trim().max(2000),
  availability: z.string().trim().max(200),
});

function Volunteer() {
  const [f, setF] = useState({ full_name: "", email: "", phone: "", track: "", experience: "", availability: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse(f);
    if (!p.success) { toast.error(p.error.issues[0]!.message); return; }
    setBusy(true);
    const { error } = await supabase.from("volunteer_applications").insert(p.data);
    setBusy(false);
    if (error) { toast.error("Could not submit. Try again."); return; }
    setDone(true);
  }
  if (done) return (
    <section className="mx-auto max-w-lg px-5 py-24 text-center">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h1 className="mt-6 text-4xl font-bold text-primary">Thank you for serving!</h1>
      <p className="mt-3 text-muted-foreground">We'll reach out at {f.email}.</p>
    </section>
  );
  const inp = (k: keyof typeof f, label: string, type = "text") => (
    <div><Label htmlFor={k}>{label}</Label><Input id={k} type={type} className="mt-1.5 h-12" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></div>
  );
  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <PageIntro eyebrow="Volunteer" title="Serve with us">Use your gifts to walk alongside young women in their calling.</PageIntro>
      <Reveal>
        <form onSubmit={submit} className="space-y-5 rounded-3xl bg-card p-5 shadow-royal sm:p-8" noValidate>
          {inp("full_name", "Full name")}
          {inp("email", "Email", "email")}
          {inp("phone", "Phone / WhatsApp (+233)", "tel")}
          <div role="radiogroup" aria-label="Volunteer track" className="grid gap-2 sm:grid-cols-2">
            {TRACKS.map((t) => (
              <button type="button" role="radio" aria-checked={f.track === t} key={t} onClick={() => setF({ ...f, track: t })}
                className={cn("rounded-2xl border-2 p-4 text-left font-label text-sm font-bold", f.track === t ? "border-gold bg-gold-soft" : "border-border")}>{t}</button>
            ))}
          </div>
          <div><Label htmlFor="experience">Relevant experience</Label><Textarea id="experience" rows={4} className="mt-1.5" value={f.experience} onChange={(e) => setF({ ...f, experience: e.target.value })} /></div>
          {inp("availability", "Availability (e.g. weekends, 4 hrs/month)")}
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">
            {busy ? <Loader2 className="animate-spin" /> : "Submit volunteer application"}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
