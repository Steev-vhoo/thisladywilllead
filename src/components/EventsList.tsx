import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Loader2, MapPin, Radio, Users } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type EventRow = {
  id: string; title: string; description: string | null; type: string; date: string;
  location: string | null; virtual_link: string | null; max_attendees: number;
};

export function EventsList({ limit }: { limit?: number }) {
  const [filter, setFilter] = useState("All");
  const [rsvp, setRsvp] = useState<EventRow | null>(null);
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").gte("date", new Date().toISOString()).order("date");
      if (error) throw error;
      return data as EventRow[];
    },
  });
  const types = ["All", ...Array.from(new Set(events.map((e) => e.type)))];
  const shown = events.filter((e) => filter === "All" || e.type === filter).slice(0, limit);

  return (
    <div>
      {!limit && (
        <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Filter events">
          {types.map((t) => (
            <button key={t} role="tab" aria-selected={filter === t} onClick={() => setFilter(t)}
              className={cn("shrink-0 rounded-full border-2 px-4 py-2 font-label text-sm font-semibold",
                filter === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
              {t}
            </button>
          ))}
        </div>
      )}
      {isLoading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      ) : shown.length === 0 ? (
        <p className="text-center text-muted-foreground">No upcoming events yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {shown.map((e) => {
            const d = new Date(e.date);
            return (
              <li key={e.id} className="flex gap-4 rounded-2xl border bg-card p-5">
                <div className="grid h-16 w-16 shrink-0 place-content-center rounded-xl bg-royal text-center text-primary-foreground">
                  <span className="eyebrow text-gold">{d.toLocaleString("en-GB", { month: "short" })}</span>
                  <span className="font-display text-2xl font-bold leading-none">{d.getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-bold text-accent-foreground">
                    {e.virtual_link ? <Radio className="h-3 w-3" /> : <CalendarDays className="h-3 w-3" />}{e.type}
                  </span>
                  <h3 className="mt-2 text-lg font-bold leading-snug">{e.title}</h3>
                  {e.description && <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>}
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.location}</span>
                    <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{e.max_attendees} spots</span>
                    <span>{d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                  </p>
                  <Button size="sm" className="mt-3 rounded-full" onClick={() => setRsvp(e)}>RSVP</Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <RsvpDialog event={rsvp} onClose={() => setRsvp(null)} />
    </div>
  );
}

const rsvpSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
});

function RsvpDialog({ event, onClose }: { event: EventRow | null; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    const p = rsvpSchema.safeParse(form);
    if (!p.success) return toast.error(p.error.issues[0].message);
    setBusy(true);
    const { data: count } = await supabase.rpc("event_rsvp_count", { _event_id: event.id });
    if ((count ?? 0) >= event.max_attendees) { setBusy(false); return toast.error("This event is full."); }
    const { error } = await supabase.from("event_rsvps").insert({ ...p.data, event_id: event.id });
    setBusy(false);
    if (error?.code === "23505") return toast.info("You've already RSVP'd for this event.");
    if (error) return toast.error("Could not RSVP. Try again.");
    toast.success("You're in! See you there.");
    setForm({ full_name: "", email: "" });
    onClose();
  }
  return (
    <Dialog open={!!event} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl">
        <DialogTitle className="font-display text-2xl">RSVP</DialogTitle>
        <DialogDescription>{event?.title}</DialogDescription>
        <form onSubmit={submit} className="space-y-4">
          <div><Label htmlFor="rn">Full name</Label><Input id="rn" className="mt-1.5 h-12" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div><Label htmlFor="re">Email</Label><Input id="re" type="email" className="mt-1.5 h-12" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">
            {busy ? <Loader2 className="animate-spin" /> : "Confirm my seat"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
