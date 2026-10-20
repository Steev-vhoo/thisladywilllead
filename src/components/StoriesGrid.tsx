import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type Story = { id: string; title: string; summary: string; content: string; category: string; author: string | null };

export function StoriesGrid({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<Story | null>(null);
  const { data = [], isLoading } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("impact_stories").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Story[];
    },
  });
  if (isLoading) return <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />;
  return (
    <>
      <ul className="grid gap-5 md:grid-cols-2">
        {data.slice(0, limit).map((s) => (
          <li key={s.id}>
            <button onClick={() => setOpen(s)} className="h-full w-full rounded-2xl border bg-card p-6 text-left transition hover:-translate-y-0.5 hover:shadow-royal">
              <span className="eyebrow text-gold">{s.category}</span>
              {s.category === "Testimonial" && <Quote className="mt-3 h-6 w-6 text-primary/30" />}
              <h3 className="mt-2 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
              {s.author && <p className="mt-4 font-label text-xs font-semibold text-primary">— {s.author}</p>}
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-xl rounded-3xl">
          <span className="eyebrow text-gold">{open?.category}</span>
          <DialogTitle className="font-display text-3xl">{open?.title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-foreground">{open?.content}</DialogDescription>
          {open?.author && <p className="font-label text-sm font-semibold text-primary">— {open.author}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
