import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Loader2, MapPin, MessageCircle, Twitter } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SOCIALS } from "@/lib/site";
import { AccraMap } from "@/components/AccraMap";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export function SiteFooter() {
  const [nlEmail, setNlEmail] = useState("");
  const [c, setC] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    const p = z.string().trim().email().max(255).safeParse(nlEmail);
    if (!p.success) { toast.error("Enter a valid email"); return; }
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: p.data });
    if (error && error.code !== "23505") { toast.error("Could not subscribe. Try again."); return; }
    toast.success("You're subscribed.");
    setNlEmail("");
  }

  async function contact(e: React.FormEvent) {
    e.preventDefault();
    const p = contactSchema.safeParse(c);
    if (!p.success) { toast.error(p.error.issues[0]!.message); return; }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(p.data);
    setBusy(false);
    if (error) { toast.error("Could not send. Please try again."); return; }
    toast.success("Message sent — we'll be in touch soon.");
    setC({ name: "", email: "", message: "" });
  }

  return (
    <footer className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-6 lg:grid-cols-3">
        <div>
          <p className="font-display text-3xl font-bold">
            This Lady <span className="text-gold">Will.</span>
          </p>
          <p className="eyebrow mt-2 text-primary-foreground/70">She Dreams. She Dares. She Does.</p>
          <form onSubmit={subscribe} className="mt-8">
            <label htmlFor="nl" className="font-label text-sm font-semibold">Join our newsletter</label>
            <div className="mt-2 flex gap-2">
              <Input id="nl" type="email" placeholder="you@email.com" value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
              <Button type="submit" className="h-12 shrink-0 bg-gold text-gold-foreground hover:bg-gold/90">Subscribe</Button>
            </div>
          </form>
          <div className="mt-8 flex gap-3">
            {[
              { href: SOCIALS.instagram, Icon: Instagram, label: "Instagram" },
              { href: SOCIALS.x, Icon: Twitter, label: "Share on X" },
              { href: SOCIALS.linkedin, Icon: Linkedin, label: "Share on LinkedIn" },
              { href: SOCIALS.facebook, Icon: Facebook, label: "Facebook" },
              { href: SOCIALS.whatsapp, Icon: MessageCircle, label: "WhatsApp community" },
            ].flatMap((s) => (s.href ? [{ ...s, href: s.href }] : [])).map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-primary-foreground/20 hover:border-gold hover:text-gold">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <form onSubmit={contact} className="space-y-3">
          <p className="font-display text-2xl font-bold">Get in touch</p>
          <Input aria-label="Name" placeholder="Name" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
          <Input aria-label="Email" type="email" placeholder="Email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} className="h-12 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
          <Textarea aria-label="Message" placeholder="How can we partner?" rows={4} value={c.message} onChange={(e) => setC({ ...c, message: e.target.value })} className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50" />
          <Button type="submit" disabled={busy} className="h-12 w-full bg-gold text-gold-foreground hover:bg-gold/90">
            {busy ? <Loader2 className="animate-spin" /> : "Send message"}
          </Button>
        </form>

        <div>
          <p className="font-display text-2xl font-bold">Visit us</p>
          <AccraMap className="mt-3 aspect-[4/3]" />
          <p className="mt-2 inline-flex items-center gap-1 text-sm text-primary-foreground/80"><MapPin className="h-4 w-4 text-gold" />Accra, Ghana · <a href="mailto:thisladywill@gmail.com" className="hover:text-gold">thisladywill@gmail.com</a></p>
          <nav className="mt-6 grid grid-cols-2 gap-2 text-sm text-primary-foreground/80" aria-label="Footer">
            <Link to="/programs" className="hover:text-gold">Programs</Link>
            <Link to="/events" className="hover:text-gold">Events</Link>
            <Link to="/stories" className="hover:text-gold">Stories</Link>
            <Link to="/blog" className="hover:text-gold">Blog</Link>
            <Link to="/resources" className="hover:text-gold">Resources</Link>
            <Link to="/volunteer" className="hover:text-gold">Volunteer</Link>
            <Link to="/contact" className="hover:text-gold">Contact</Link>
            <Link to="/donate" className="hover:text-gold">Donate</Link>
          </nav>
        </div>
      </div>
      <p className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} This Lady Will. All rights reserved.
      </p>
    </footer>
  );
}
