import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Quote, Search } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type Story = { id: string; title: string; summary: string; content: string; category: string; author: string | null; created_at: string };

function useStories() {
  return useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("impact_stories").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Story[];
    },
  });
}

function StoryDialog({ story, onClose }: { story: Story | null; onClose: () => void }) {
  return (
    <Dialog open={!!story} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-xl rounded-3xl">
        <span className="eyebrow text-gold">{story?.category}</span>
        <DialogTitle className="font-display text-3xl">{story?.title}</DialogTitle>
        <DialogDescription className="text-base leading-relaxed text-foreground">{story?.content}</DialogDescription>
        {story?.author && <p className="font-label text-sm font-semibold text-primary">— {story.author}</p>}
      </DialogContent>
    </Dialog>
  );
}

export function useHasTestimonials() {
  const { data = [] } = useStories();
  return data.some((s) => s.category === "Testimonial");
}

/** Testimonials from fellows. */
export function StoriesGrid({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<Story | null>(null);
  const { data = [], isLoading } = useStories();
  if (isLoading) return <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />;
  const items = data.filter((s) => s.category === "Testimonial").slice(0, limit);
  if (items.length === 0)
    return <p className="rounded-3xl border border-dashed p-10 text-center text-muted-foreground">Stories from our fellows are coming soon.</p>;
  return (
    <>
      <Stagger className="grid gap-5 md:grid-cols-3">
        {items.map((s) => (
          <StaggerItem key={s.id}>
            <button onClick={() => setOpen(s)} className="h-full w-full rounded-3xl border bg-card p-6 text-left transition hover:-translate-y-0.5 hover:shadow-royal">
              <Quote className="h-8 w-8 text-gold" />
              <p className="mt-3 font-display text-lg italic leading-snug text-foreground">{s.summary}</p>
              <h3 className="mt-4 font-label text-sm font-bold text-primary">{s.title}</h3>
              {s.author && <p className="mt-1 text-xs text-muted-foreground">— {s.author}</p>}
            </button>
          </StaggerItem>
        ))}
      </Stagger>
      <StoryDialog story={open} onClose={() => setOpen(null)} />
    </>
  );
}

/** Blog articles (non-testimonial stories) with search and categories. */
export function BlogList() {
  const [open, setOpen] = useState<Story | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const { data = [], isLoading } = useStories();
  const posts = data.filter((s) => s.category !== "Testimonial");
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const shown = posts.filter((p) => (cat === "All" || p.category === cat) &&
    (p.title + p.summary + (p.author ?? "")).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Search articles" placeholder="Search articles…" className="h-12 pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={cn("shrink-0 rounded-full border-2 px-4 py-2 font-label text-sm font-semibold", cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{c}</button>
        ))}
      </div>
      {isLoading ? <Loader2 className="mx-auto mt-8 h-8 w-8 animate-spin text-primary" /> : shown.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No articles found.</p>
      ) : (
        <Stagger className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <StaggerItem key={p.id}>
              <button onClick={() => setOpen(p)} className="h-full w-full rounded-3xl border bg-card p-6 text-left transition hover:shadow-royal">
                <span className="eyebrow text-gold">{p.category}</span>
                <h3 className="mt-2 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                <p className="mt-4 font-label text-xs font-semibold text-primary">By {p.author ?? "This Lady Will"} · {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      )}
      <StoryDialog story={open} onClose={() => setOpen(null)} />
    </div>
  );
}

const shareSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  cohort: z.string().trim().max(100),
  story: z.string().trim().min(20, "Share at least 20 characters").max(5000),
});

export function ShareStoryButton() {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ full_name: "", email: "", cohort: "", story: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = shareSchema.safeParse(f);
    if (!p.success) { toast.error(p.error.issues[0]!.message); return; }
    setBusy(true);
    const { error } = await supabase.from("story_submissions").insert(p.data);
    setBusy(false);
    if (error) { toast.error("Could not send. Try again."); return; }
    toast.success("Thank you for sharing your story!");
    setF({ full_name: "", email: "", cohort: "", story: "" });
    setOpen(false);
  }
  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">Share Your Story</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md rounded-3xl">
          <DialogTitle className="font-display text-2xl">Share your story</DialogTitle>
          <DialogDescription>Tell us how God has grown you through This Lady Will.</DialogDescription>
          <form onSubmit={submit} className="space-y-3">
            <div><Label htmlFor="sn">Name</Label><Input id="sn" className="mt-1 h-11" value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} /></div>
            <div><Label htmlFor="se">Email</Label><Input id="se" type="email" className="mt-1 h-11" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
            <div><Label htmlFor="sc">Program / cohort</Label><Input id="sc" className="mt-1 h-11" value={f.cohort} onChange={(e) => setF({ ...f, cohort: e.target.value })} /></div>
            <div><Label htmlFor="ss">Your story</Label><Textarea id="ss" rows={5} className="mt-1" value={f.story} onChange={(e) => setF({ ...f, story: e.target.value })} /></div>
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl">{busy ? <Loader2 className="animate-spin" /> : "Submit story"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
