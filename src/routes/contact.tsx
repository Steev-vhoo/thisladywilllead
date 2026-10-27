import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro } from "@/components/PageIntro";
import { Reveal } from "@/components/Reveal";
import { CONTACT } from "@/lib/site";
import { AccraMap } from "@/components/AccraMap";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | This Lady Will" },
      { name: "description", content: "Email thisladywill@gmail.com or send us a message. Based in Accra, Ghana." },
      { property: "og:title", content: "Contact | This Lady Will" },
      { property: "og:description", content: "Get in touch with This Lady Will in Accra, Ghana." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function Contact() {
  const [c, setC] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse(c);
    if (!p.success) { toast.error(p.error.issues[0]!.message); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(p.data);
    setBusy(false);
    if (error) { toast.error("Could not send. Please try again."); return; }
    toast.success("Message sent — we'll be in touch soon.");
    setC({ name: "", email: "", message: "" });
  }
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
      <PageIntro eyebrow="Contact" title="Let's walk together" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal className="space-y-6">
          <ul className="space-y-3 text-lg">
            <li><a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-3 hover:text-primary"><Mail className="text-gold" />{CONTACT.email}</a></li>
            {CONTACT.phone && <li className="inline-flex items-center gap-3"><Phone className="text-gold" />{CONTACT.phone}</li>}
            {CONTACT.whatsapp && <li><a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-primary"><MessageCircle className="text-gold" />Chat on WhatsApp</a></li>}
            <li className="inline-flex items-center gap-3"><MapPin className="text-gold" />{CONTACT.location}</li>
          </ul>
          <AccraMap className="h-80 shadow-royal" />
        </Reveal>
        <Reveal>
          <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-6 shadow-royal sm:p-8">
            <div><Label htmlFor="cn">Name</Label><Input id="cn" className="mt-1.5 h-12" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
            <div><Label htmlFor="ce">Email</Label><Input id="ce" type="email" className="mt-1.5 h-12" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></div>
            <div><Label htmlFor="cm">Message</Label><Textarea id="cm" rows={6} className="mt-1.5" value={c.message} onChange={(e) => setC({ ...c, message: e.target.value })} /></div>
            <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">
              {busy ? <Loader2 className="animate-spin" /> : "Send message"}
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
