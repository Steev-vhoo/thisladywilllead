import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsList } from "@/components/EventsList";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "Member Portal | This Lady Will" }, { name: "robots", content: "noindex" }] }),
  component: Portal,
});

const GUIDES = [
  { title: "Mentorship Circles guide", file: "/guides/mentorship-circles.txt" },
  { title: "Leadership Academy guide", file: "/guides/leadership-academy.txt" },
  { title: "Career Clarity guide", file: "/guides/career-clarity.txt" },
];

function Portal() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: members = [] } = useQuery({
    queryKey: ["directory"],
    queryFn: async () => (await supabase.from("profiles").select("id, full_name").order("full_name")).data ?? [],
  });
  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }
  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-black text-primary">Member Portal</h1>
        <div className="flex gap-2">
          <Button asChild variant="secondary" className="rounded-full"><Link to="/admin">Admin</Link></Button>
          <Button variant="outline" onClick={signOut} className="rounded-full"><LogOut className="mr-1 h-4 w-4" />Sign out</Button>
        </div>
      </div>
      <Tabs defaultValue="guides" className="mt-8">
        <TabsList className="w-full sm:w-auto"><TabsTrigger value="guides">Guides</TabsTrigger><TabsTrigger value="schedule">Schedule</TabsTrigger><TabsTrigger value="directory">Directory</TabsTrigger></TabsList>
        <TabsContent value="guides" className="mt-6 grid gap-3 sm:grid-cols-3">
          {GUIDES.map((g) => (
            <a key={g.file} href={g.file} download className="flex items-center justify-between rounded-2xl border bg-card p-5 hover:border-gold">
              <span className="font-display font-bold">{g.title}</span><Download className="h-5 w-5 text-gold" />
            </a>
          ))}
        </TabsContent>
        <TabsContent value="schedule" className="mt-6"><EventsList /></TabsContent>
        <TabsContent value="directory" className="mt-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {members.map((m) => <li key={m.id} className="rounded-xl border bg-card p-4 font-semibold">{m.full_name}</li>)}
          </ul>
        </TabsContent>
      </Tabs>
    </section>
  );
}
