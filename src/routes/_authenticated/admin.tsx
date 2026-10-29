import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mediaUrl, removeMedia, uploadMedia, useGallery, useTeam } from "@/lib/media";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard | This Lady Will" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return false;
      const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
      return !!data;
    },
  });
}

function Admin() {
  const { data: isAdmin, isLoading } = useIsAdmin();
  if (isLoading) return <p className="p-12 text-center">Loading…</p>;
  if (!isAdmin)
    return (
      <section className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-primary">Admins only</h1>
        <p className="mt-3 text-muted-foreground">Your account doesn't have admin access.</p>
        <Button asChild className="mt-6 rounded-full"><Link to="/portal">Back to portal</Link></Button>
      </section>
    );
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-black text-primary">Admin Dashboard</h1>
      <Tabs defaultValue="stories" className="mt-8">
        <TabsList className="flex w-full flex-wrap h-auto sm:w-auto">
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
        </TabsList>
        <TabsContent value="stories" className="mt-6"><StoriesAdmin /></TabsContent>
        <TabsContent value="events" className="mt-6"><EventsAdmin /></TabsContent>
        <TabsContent value="gallery" className="mt-6"><GalleryAdmin /></TabsContent>
        <TabsContent value="team" className="mt-6"><TeamAdmin /></TabsContent>
        <TabsContent value="applications" className="mt-6"><ApplicationsAdmin /></TabsContent>
        <TabsContent value="donations" className="mt-6"><DonationsAdmin /></TabsContent>
      </Tabs>
    </section>
  );
}

const emptyStory = { id: "", title: "", summary: "", content: "", image_url: "", category: "Story", author: "" };

function StoriesAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyStory);
  const { data: stories = [] } = useQuery({
    queryKey: ["admin-stories"],
    queryFn: async () => (await supabase.from("impact_stories").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const refresh = () => qc.invalidateQueries();
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { id, ...rest } = form;
    const payload = { ...rest, image_url: rest.image_url || null, author: rest.author || null };
    const { error } = id
      ? await supabase.from("impact_stories").update(payload).eq("id", id)
      : await supabase.from("impact_stories").insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(id ? "Story updated" : "Story published");
    setForm(emptyStory); refresh();
  }
  async function remove(id: string) {
    if (!confirm("Delete this story?")) return;
    const { error } = await supabase.from("impact_stories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Story deleted"); refresh();
  }
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-2xl font-bold">{form.id ? "Edit story" : "New story"}</h2>
        <Field label="Title"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Summary"><Textarea required rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
        <Field label="Content"><Textarea required rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category"><Input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="Author"><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></Field>
        </div>
        <Field label="Image URL"><Input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></Field>
        <div className="flex gap-2">
          <Button type="submit" className="rounded-full">{form.id ? "Save changes" : "Publish"}</Button>
          {form.id && <Button type="button" variant="outline" className="rounded-full" onClick={() => setForm(emptyStory)}>Cancel</Button>}
        </div>
      </form>
      <ul className="space-y-3">
        {stories.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-3 rounded-xl border bg-card p-4">
            <div><p className="font-semibold">{s.title}</p><p className="text-sm text-muted-foreground">{s.category}</p></div>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setForm({ id: s.id, title: s.title, summary: s.summary, content: s.content, image_url: s.image_url ?? "", category: s.category, author: s.author ?? "" })}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </li>
        ))}
        {stories.length === 0 && <p className="text-muted-foreground">No stories yet.</p>}
      </ul>
    </div>
  );
}

const emptyEvent = { id: "", title: "", description: "", type: "Workshop", date: "", location: "", virtual_link: "", max_attendees: 50, image_path: null as string | null };

function toLocalInput(iso: string) {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function EventsAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyEvent);
  const [image, setImage] = useState<File | null>(null);
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => (await supabase.from("events").select("*").order("date", { ascending: false })).data ?? [],
  });
  const { data: rsvps = [] } = useQuery({
    queryKey: ["admin-rsvps"],
    queryFn: async () => (await supabase.from("event_rsvps").select("*").order("created_at")).data ?? [],
  });
  const refresh = () => qc.invalidateQueries();
  function reset(target?: HTMLFormElement) {
    setForm(emptyEvent); setImage(null); setSavedImage(null); target?.reset();
  }
  function edit(ev: (typeof events)[number]) {
    setForm({ id: ev.id, title: ev.title, description: ev.description ?? "", type: ev.type, date: toLocalInput(ev.date), location: ev.location ?? "", virtual_link: ev.virtual_link ?? "", max_attendees: ev.max_attendees, image_path: ev.image_path });
    setImage(null); setSavedImage(ev.image_path);
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    setBusy(true);
    try {
      const { id, ...rest } = form;
      const image_path = image ? await uploadMedia("events", image) : rest.image_path;
      const payload = { ...rest, image_path, date: new Date(rest.date).toISOString(), description: rest.description || null, location: rest.location || null, virtual_link: rest.virtual_link || null };
      const { error } = id ? await supabase.from("events").update(payload).eq("id", id) : await supabase.from("events").insert(payload);
      if (error) { if (image) await removeMedia(image_path); throw error; }
      // The old image is only deleted once the event no longer points to it.
      if (savedImage && savedImage !== image_path) await removeMedia(savedImage);
      toast.success(id ? "Event updated" : "Event posted");
      reset(target); refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save event");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string, path: string | null) {
    if (!confirm("Delete this event and its sign-ups?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await removeMedia(path);
    toast.success("Event deleted"); refresh();
  }
  const preview = image ? URL.createObjectURL(image) : form.image_path ? mediaUrl(form.image_path) : null;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-2xl font-bold">{form.id ? "Edit event" : "New event"}</h2>
        <Field label="Title"><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Description"><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Type"><Input required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} /></Field>
          <Field label="Date & time"><Input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Max attendees"><Input required type="number" min={1} value={form.max_attendees} onChange={(e) => setForm({ ...form, max_attendees: Number(e.target.value) })} /></Field>
        </div>
        <Field label="Online link"><Input type="url" value={form.virtual_link} onChange={(e) => setForm({ ...form, virtual_link: e.target.value })} /></Field>
        <Field label={preview ? "Replace flyer / image" : "Flyer / image (JPG, PNG or WebP, up to 5 MB)"}>
          <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        </Field>
        {preview && (
          <div className="flex items-end gap-3">
            <img src={preview} alt="Event image preview" className="h-40 rounded-lg border object-contain" />
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={(e) => {
              setImage(null); setForm({ ...form, image_path: null });
              const input = (e.currentTarget.closest("form") as HTMLFormElement).querySelector<HTMLInputElement>('input[type="file"]');
              if (input) input.value = "";
            }}>Remove image</Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button type="submit" disabled={busy} className="rounded-full">{busy ? "Saving…" : form.id ? "Save changes" : "Post event"}</Button>
          {form.id && <Button type="button" variant="outline" className="rounded-full" onClick={(e) => reset(e.currentTarget.closest("form") as HTMLFormElement)}>Cancel</Button>}
        </div>
      </form>
      <ul className="space-y-3">
        {events.map((ev) => {
          const list = rsvps.filter((r) => r.event_id === ev.id);
          return (
            <li key={ev.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {ev.image_path && <img src={mediaUrl(ev.image_path)} alt="" className="h-14 w-11 shrink-0 rounded object-cover object-top" />}
                  <div>
                  <p className="font-semibold">{ev.title}</p>
                  <p className="text-sm text-muted-foreground">{new Date(ev.date).toLocaleString()} · {list.length}/{ev.max_attendees} signed up</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => edit(ev)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(ev.id, ev.image_path)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              {list.length > 0 && (
                <details className="mt-2 text-sm"><summary className="cursor-pointer text-primary">View sign-ups</summary>
                  <ul className="mt-2 space-y-1">{list.map((r) => <li key={r.id}>{r.full_name} — {r.email}</li>)}</ul>
                </details>
              )}
            </li>
          );
        })}
        {events.length === 0 && <p className="text-muted-foreground">No events yet.</p>}
      </ul>
    </div>
  );
}

function ApplicationsAdmin() {
  const { data = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => (await supabase.from("volunteers_or_applicants").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  if (!data.length) return <p className="text-muted-foreground">No applications yet.</p>;
  return (
    <ul className="space-y-3">
      {data.map((a) => (
        <li key={a.id} className="rounded-xl border bg-card p-4">
          <p className="font-semibold">{a.full_name} <span className="font-normal text-muted-foreground">· {a.program_or_track}</span></p>
          <p className="text-sm text-muted-foreground">{a.email}{a.phone ? ` · ${a.phone}` : ""} · {new Date(a.created_at).toLocaleDateString()}</p>
          <details className="mt-2 text-sm"><summary className="cursor-pointer text-primary">Read application</summary>
            <div className="mt-2 space-y-2">
              {a.education && <p><b>Education:</b> {a.education}</p>}
              {a.career_aspirations && <p><b>Aspirations:</b> {a.career_aspirations}</p>}
              <p><b>Statement:</b> {a.statement}</p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

function DonationsAdmin() {
  const { data = [] } = useQuery({
    queryKey: ["admin-donations"],
    queryFn: async () => (await supabase.from("donations").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  if (!data.length) return <p className="text-muted-foreground">No donations yet.</p>;
  return (
    <ul className="space-y-2">
      {data.map((d) => (
        <li key={d.id} className="flex flex-wrap justify-between gap-2 rounded-xl border bg-card p-4 text-sm">
          <span className="font-semibold">{d.donor_name} <span className="font-normal text-muted-foreground">{d.donor_email}</span></span>
          <span>{d.currency} {Number(d.amount).toLocaleString()} · {d.status} · {new Date(d.created_at).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
}

function GalleryAdmin() {
  const qc = useQueryClient();
  const { data: photos = [] } = useGallery();
  const [files, setFiles] = useState<File[]>([]);
  const [album, setAlbum] = useState("General");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setBusy(true);
    try {
      for (const file of files) {
        const image_path = await uploadMedia("gallery", file);
        const { error } = await supabase.from("gallery_items").insert({ image_path, album, caption: caption || null });
        if (error) { await removeMedia(image_path); throw error; }
      }
      toast.success(files.length === 1 ? "Photo added" : `${files.length} photos added`);
      setFiles([]); setCaption(""); (e.target as HTMLFormElement).reset();
      qc.invalidateQueries({ queryKey: ["gallery"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string, path: string) {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await removeMedia(path);
    toast.success("Photo deleted"); qc.invalidateQueries({ queryKey: ["gallery"] });
  }
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={upload} className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-2xl font-bold">Add photos</h2>
        <Field label="Photos (JPG, PNG or WebP, up to 5 MB each)">
          <Input type="file" accept="image/jpeg,image/png,image/webp" multiple required onChange={(e) => setFiles([...(e.target.files ?? [])])} />
        </Field>
        <Field label="Album"><Input required value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="e.g. Mentorship Conference 2026" /></Field>
        <Field label="Caption (optional, applies to all selected photos)"><Input value={caption} onChange={(e) => setCaption(e.target.value)} /></Field>
        <p className="text-sm text-muted-foreground">Only publish photos of people who have agreed to appear on the website.</p>
        <Button type="submit" disabled={busy} className="rounded-full">{busy ? "Uploading…" : "Upload"}</Button>
      </form>
      <ul className="grid grid-cols-3 gap-3 self-start">
        {photos.map((p) => (
          <li key={p.id} className="relative overflow-hidden rounded-xl border">
            <img src={mediaUrl(p.image_path)} alt={p.caption ?? p.album} className="aspect-square w-full object-cover" />
            <p className="truncate px-2 py-1 text-xs text-muted-foreground">{p.album}</p>
            <Button size="icon" variant="secondary" aria-label="Delete photo" className="absolute right-1 top-1 h-8 w-8" onClick={() => remove(p.id, p.image_path)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </li>
        ))}
        {photos.length === 0 && <p className="col-span-3 text-muted-foreground">No photos yet.</p>}
      </ul>
    </div>
  );
}

const emptyMember = { id: "", full_name: "", role: "", group_name: "Mentor", bio: "", sort_order: 10, photo_path: null as string | null };

function TeamAdmin() {
  const qc = useQueryClient();
  const { data: team = [] } = useTeam();
  const [form, setForm] = useState(emptyMember);
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { id, ...rest } = form;
      let photo_path = rest.photo_path;
      if (photo) {
        photo_path = await uploadMedia("team", photo);
        await removeMedia(rest.photo_path);
      }
      const payload = { ...rest, photo_path, bio: rest.bio || null };
      const { error } = id
        ? await supabase.from("team_members").update(payload).eq("id", id)
        : await supabase.from("team_members").insert(payload);
      if (error) throw error;
      toast.success(id ? "Profile updated" : "Profile added");
      setForm(emptyMember); setPhoto(null); (e.target as HTMLFormElement).reset();
      qc.invalidateQueries({ queryKey: ["team"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string, path: string | null) {
    if (!confirm("Delete this profile?")) return;
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await removeMedia(path);
    toast.success("Profile deleted"); qc.invalidateQueries({ queryKey: ["team"] });
  }
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={save} className="space-y-4 rounded-2xl border bg-card p-6">
        <h2 className="font-display text-2xl font-bold">{form.id ? "Edit profile" : "New profile"}</h2>
        <Field label="Full name"><Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Role / title"><Input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Mentor, Leadership Academy" /></Field>
          <Field label="Group">
            <select value={form.group_name} onChange={(e) => setForm({ ...form, group_name: e.target.value })} className="h-10 w-full rounded-md border bg-background px-3 text-sm">
              <option>Founder</option><option>Team</option><option>Mentor</option>
            </select>
          </Field>
        </div>
        <Field label="Short bio (optional)"><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={form.photo_path ? "Replace photo" : "Photo"}><Input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} /></Field>
          <Field label="Order (lower shows first)"><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></Field>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={busy} className="rounded-full">{busy ? "Saving…" : form.id ? "Save changes" : "Add profile"}</Button>
          {form.id && <Button type="button" variant="outline" className="rounded-full" onClick={() => setForm(emptyMember)}>Cancel</Button>}
        </div>
      </form>
      <ul className="space-y-3">
        {team.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4">
            <div className="flex items-center gap-3">
              {m.photo_path ? (
                <img src={mediaUrl(m.photo_path)} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary"><UserRound className="h-5 w-5" /></div>
              )}
              <div><p className="font-semibold">{m.full_name}</p><p className="text-sm text-muted-foreground">{m.group_name} · {m.role}</p></div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setForm({ id: m.id, full_name: m.full_name, role: m.role, group_name: m.group_name, bio: m.bio ?? "", sort_order: m.sort_order, photo_path: m.photo_path })}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(m.id, m.photo_path)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </li>
        ))}
        {team.length === 0 && <p className="text-muted-foreground">No profiles yet.</p>}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
