import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPanel() {
  const nav = useNavigate();
  const [role, setRole] = useState<"member" | "mentor">("member");
  const [mode, setMode] = useState<"in" | "up" | "magic">("in");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({ email: f.email, options: { emailRedirectTo: `${window.location.origin}/portal` } });
        if (error) throw error;
        toast.success("Check your email for a sign-in link.");
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email: f.email, password: f.password, options: { emailRedirectTo: window.location.origin, data: { full_name: f.name, portal_role: role } } });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        nav({ to: "/portal" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-center text-4xl font-black text-primary">Member Area</h1>
      <div role="tablist" className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-royal p-1">
        {([["member", "Member Login"], ["mentor", "Mentor Login"]] as const).map(([r, l]) => (
          <button key={r} role="tab" aria-selected={role === r} onClick={() => setRole(r)} className={`rounded-lg py-2.5 font-label text-sm font-bold ${role === r ? "bg-gold text-gold-foreground" : "text-primary-foreground/80"}`}>{l}</button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
        {([["in", "Sign in"], ["up", "Sign up"], ["magic", "Magic link"]] as const).map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-lg py-2 font-label text-sm font-semibold ${mode === m ? "bg-card text-primary shadow" : "text-muted-foreground"}`}>{l}</button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-3xl bg-card p-6 shadow-royal">
        {mode === "up" && <div><Label htmlFor="n">Full name</Label><Input id="n" required className="mt-1.5 h-12" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>}
        <div><Label htmlFor="e">Email</Label><Input id="e" type="email" required className="mt-1.5 h-12" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        {mode !== "magic" && <div><Label htmlFor="p">Password</Label><Input id="p" type="password" required minLength={8} className="mt-1.5 h-12" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>}
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl">
          {busy ? <Loader2 className="animate-spin" /> : mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send magic link"}
        </Button>
      </form>
    </section>
  );
}
