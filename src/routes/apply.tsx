import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { PROGRAMS } from "@/lib/site";
import { cn } from "@/lib/utils";

const slugs = PROGRAMS.map((p) => p.slug) as [string, ...string[]];

export const Route = createFileRoute("/apply")({
  validateSearch: z.object({ track: z.enum(slugs).optional() }),
  head: () => ({
    meta: [
      { title: "Apply to the Cohort | This Lady Will" },
      { name: "description", content: "Apply to Mentorship Circles, Leadership Academy or Career Clarity." },
      { property: "og:title", content: "Apply | This Lady Will" },
      { property: "og:description", content: "Join the next cohort of young women leaders." },
    ],
  }),
  component: Apply,
});

const steps = [
  { title: "About you", schema: z.object({
    full_name: z.string().trim().min(2, "Enter your full name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().regex(/^\+?\d{9,15}$/, "Enter a valid phone number"),
    location: z.string().trim().min(2, "Enter your city/region").max(100),
  }) },
  { title: "Track", schema: z.object({ program_or_track: z.string().min(1, "Choose a track") }) },
  { title: "Education & goals", schema: z.object({
    education: z.string().trim().min(2, "Tell us your education").max(500),
    career_aspirations: z.string().trim().min(10, "Share a little more (10+ characters)").max(1000),
  }) },
  { title: "Statement", schema: z.object({
    statement: z.string().trim().min(50, "Please write at least 50 characters").max(3000),
  }) },
];

function Apply() {
  const { track } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [f, setF] = useState({
    full_name: "", email: "", phone: "", location: "",
    program_or_track: track ?? "", education: "", career_aspirations: "", statement: "",
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  function validate() {
    const r = steps[step]!.schema.safeParse(f);
    if (r.success) { setErrs({}); return true; }
    const m: Record<string, string> = {};
    r.error.issues.forEach((i) => (m[String(i.path[0])] = i.message));
    setErrs(m);
    return false;
  }

  async function next(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (step < steps.length - 1) { setStep(step + 1); window.scrollTo({ top: 0 }); return; }
    setBusy(true);
    const { error } = await supabase.from("volunteers_or_applicants").insert({
      ...f, program_or_track: PROGRAMS.find((p) => p.slug === f.program_or_track)?.name ?? f.program_or_track,
    });
    setBusy(false);
    if (error) { toast.error("Could not submit. Please try again."); return; }
    setDone(true);
  }

  if (done) {
    return (
      <section className="mx-auto max-w-lg px-5 py-24 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-6 text-4xl font-bold text-primary">Application received!</h1>
        <p className="mt-3 text-muted-foreground">Thank you, {f.full_name.split(" ")[0]}. We'll be in touch at {f.email}.</p>
        <Button asChild className="mt-8 rounded-full px-8"><Link to="/">Back home</Link></Button>
      </section>
    );
  }

  const field = (k: keyof typeof f, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} className="mt-1.5 h-12" value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]} {...props} />
      {errs[k] && <p className="mt-1 text-sm text-destructive">{errs[k]}</p>}
    </div>
  );
  const area = (k: keyof typeof f, label: string, rows = 4) => (
    <div>
      <Label htmlFor={k}>{label}</Label>
      <Textarea id={k} rows={rows} className="mt-1.5" value={f[k]} onChange={set(k)} aria-invalid={!!errs[k]} />
      <div className="mt-1 flex justify-between text-xs">
        <span className="text-destructive">{errs[k]}</span>
        <span className="text-muted-foreground">{f[k].length}</span>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-xl px-4 py-10 sm:py-16">
      <p className="eyebrow text-gold">Join the cohort</p>
      <h1 className="mt-2 text-4xl font-black text-primary">Program application</h1>
      <div className="mt-6">
        <div className="mb-2 flex justify-between font-label text-xs font-semibold text-muted-foreground">
          <span>Step {step + 1} of {steps.length}</span><span>{steps[step]!.title}</span>
        </div>
        <Progress value={((step + 1) / steps.length) * 100} />
      </div>
      <form onSubmit={next} className="mt-8 space-y-5 rounded-3xl bg-card p-5 shadow-royal sm:p-8" noValidate>
        {step === 0 && (<>
          {field("full_name", "Full name", { autoComplete: "name" })}
          {field("email", "Email", { type: "email", autoComplete: "email" })}
          {field("phone", "Phone", { type: "tel", inputMode: "tel", autoComplete: "tel", placeholder: "024 123 4567" })}
          {field("location", "City / Region")}
        </>)}
        {step === 1 && (
          <div role="radiogroup" aria-label="Track preference" className="grid gap-3">
            {PROGRAMS.map((p) => (
              <button type="button" role="radio" aria-checked={f.program_or_track === p.slug} key={p.slug}
                onClick={() => setF({ ...f, program_or_track: p.slug })}
                className={cn("flex items-start gap-3 rounded-2xl border-2 p-4 text-left",
                  f.program_or_track === p.slug ? "border-gold bg-gold-soft" : "border-border")}>
                <p.icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <span><span className="block font-display text-lg font-bold">{p.name}</span>
                  <span className="text-sm text-muted-foreground">{p.blurb}</span></span>
              </button>
            ))}
            {errs["program_or_track"] && <p className="text-sm text-destructive">{errs["program_or_track"]}</p>}
          </div>
        )}
        {step === 2 && (<>
          {area("education", "Education (school, programme, level)", 3)}
          {area("career_aspirations", "Career aspirations")}
        </>)}
        {step === 3 && area("statement", "Personal statement — why do you want to lead?", 8)}
        <div className="flex gap-3 pt-2">
          {step > 0 && <Button type="button" variant="outline" className="h-12 flex-1 rounded-xl" onClick={() => setStep(step - 1)}>Back</Button>}
          <Button type="submit" disabled={busy} className="h-12 flex-[2] rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">
            {busy ? <Loader2 className="animate-spin" /> : step === steps.length - 1 ? "Submit application" : "Continue"}
          </Button>
        </div>
      </form>
    </section>
  );
}
