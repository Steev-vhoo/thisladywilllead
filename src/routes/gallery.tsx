import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PageIntro } from "@/components/PageIntro";
import { Stagger, StaggerItem } from "@/components/Reveal";
import { mediaUrl, useGallery } from "@/lib/media";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | This Lady Will" },
      { name: "description", content: "Moments from This Lady Will cohorts, conferences and sisterhood gatherings." },
      { property: "og:title", content: "Gallery | This Lady Will" },
      { property: "og:description", content: "Moments from our cohorts, conferences and gatherings." },
    ],
  }),
  component: Gallery,
});

type Photo = NonNullable<ReturnType<typeof useGallery>["data"]>[number];

function Gallery() {
  const { data = [], isLoading } = useGallery();
  const [album, setAlbum] = useState("All");
  const [open, setOpen] = useState<Photo | null>(null);
  const albums = ["All", ...new Set(data.map((p) => p.album))];
  const photos = album === "All" ? data : data.filter((p) => p.album === album);
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Gallery" title="Moments of becoming">
        <p>Cohorts, conferences and sisterhood gatherings.</p>
      </PageIntro>
      {isLoading ? (
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
      ) : data.length === 0 ? (
        <div className="rounded-3xl border border-dashed p-12 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-10 w-10 text-gold" />
          <p className="mt-3">Photos are on their way.</p>
        </div>
      ) : (
        <>
          {albums.length > 2 && (
            <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Albums">
              {albums.map((a) => (
                <button
                  key={a}
                  role="tab"
                  aria-selected={album === a}
                  onClick={() => setAlbum(a)}
                  className={cn(
                    "rounded-full border px-4 py-2 font-label text-sm font-semibold",
                    album === a ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          )}
          <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <StaggerItem key={p.id}>
                <button onClick={() => setOpen(p)} className="group block w-full overflow-hidden rounded-2xl bg-secondary">
                  <img
                    src={mediaUrl(p.image_path)}
                    alt={p.caption ?? p.album}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </>
      )}
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-4xl rounded-3xl p-3 sm:p-4">
          <DialogTitle className="sr-only">{open?.caption ?? open?.album ?? "Photo"}</DialogTitle>
          {open && <img src={mediaUrl(open.image_path)} alt={open.caption ?? open.album} className="max-h-[75vh] w-full rounded-2xl object-contain" />}
          {open?.caption && <DialogDescription className="px-1 pb-1 text-base text-foreground">{open.caption}</DialogDescription>}
        </DialogContent>
      </Dialog>
    </section>
  );
}
