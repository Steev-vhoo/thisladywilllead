import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, CreditCard, Loader2, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DONATION_TIERS } from "@/lib/site";
import {
  confirmSimulatedDonation,
  donationSchema,
  initializeDonation,
} from "@/lib/donations.functions";
import { cn } from "@/lib/utils";

const NETWORKS = [
  { id: "mtn", name: "MTN MoMo" },
  { id: "telecel", name: "Telecel Cash" },
  { id: "at", name: "AT Money" },
] as const;

const fmt = (n: number) => `GHS ${n.toLocaleString("en-GH")}`;

export function DonationWidget() {
  const [tier, setTier] = useState<string>("sister");
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"MoMo" | "Card">("MoMo");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [sim, setSim] = useState<{ reference: string; amount: number } | null>(null);
  const init = useServerFn(initializeDonation);

  const amount =
    tier === "custom" ? Number(custom) || 0 : DONATION_TIERS.find((t) => t.id === tier)!.amount;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = donationSchema.safeParse({ donor_name: name, donor_email: email, amount, method });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const res = await init({ data: parsed.data });
      if (res.mode === "live" && res.authorization_url) {
        window.location.href = res.authorization_url;
        return;
      }
      setSim({ reference: res.reference, amount });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="rounded-3xl bg-card p-5 shadow-royal sm:p-8" noValidate>
        <p className="eyebrow text-gold">Choose your impact</p>
        <div className="mt-4 grid gap-3">
          {DONATION_TIERS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setTier(t.id)}
              aria-pressed={tier === t.id}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition",
                tier === t.id ? "border-gold bg-gold-soft" : "border-border hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2",
                  tier === t.id ? "border-gold bg-gold text-gold-foreground" : "border-input",
                )}
              >
                {tier === t.id && <Check className="h-3 w-3" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="font-label text-sm font-bold text-foreground">{t.label}</span>
                  <span className="font-display text-xl font-bold text-primary">
                    {fmt(t.amount)}
                    <span className="text-sm font-normal text-muted-foreground">{t.cadence}</span>
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{t.impact}</span>
              </span>
            </button>
          ))}
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl border-2 p-4",
              tier === "custom" ? "border-gold bg-gold-soft" : "border-border",
            )}
          >
            <Label htmlFor="custom" className="shrink-0 font-label text-sm font-bold">
              Other (GHS)
            </Label>
            <Input
              id="custom"
              inputMode="numeric"
              placeholder="e.g. 300"
              value={custom}
              onFocus={() => setTier("custom")}
              onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
              className="h-11 bg-card"
            />
          </div>
          {errors["amount"] && <p className="text-sm text-destructive">{errors["amount"]}</p>}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="dn">Full name</Label>
            <Input id="dn" className="mt-1.5 h-12" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            {errors["donor_name"] && <p className="mt-1 text-sm text-destructive">{errors["donor_name"]}</p>}
          </div>
          <div>
            <Label htmlFor="de">Email for receipt</Label>
            <Input id="de" type="email" className="mt-1.5 h-12" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {errors["donor_email"] && <p className="mt-1 text-sm text-destructive">{errors["donor_email"]}</p>}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Payment method">
          {(["MoMo", "Card"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={method === m}
              onClick={() => setMethod(m)}
              className={cn(
                "flex h-12 items-center justify-center gap-2 rounded-xl border-2 font-label text-sm font-semibold",
                method === m ? "border-primary bg-secondary text-primary" : "border-border",
              )}
            >
              {m === "MoMo" ? <Smartphone className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
              {m === "MoMo" ? "Mobile Money" : "Card"}
            </button>
          ))}
        </div>

        <Button type="submit" disabled={busy} className="mt-6 h-14 w-full rounded-xl bg-gold text-base font-bold text-gold-foreground shadow-gold hover:bg-gold/90">
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Give {amount > 0 ? fmt(amount) : ""} now</>}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Secured by Paystack · MTN, Telecel, AT & cards
        </p>
      </form>

      <MomoModal
        open={!!sim}
        reference={sim?.reference ?? ""}
        amount={sim?.amount ?? 0}
        email={email}
        onClose={() => setSim(null)}
      />
    </>
  );
}

function MomoModal({
  open,
  reference,
  amount,
  email,
  onClose,
}: {
  open: boolean;
  reference: string;
  amount: number;
  email: string;
  onClose: () => void;
}) {
  const [network, setNetwork] = useState<string>("mtn");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"details" | "prompt" | "success">("details");
  const [err, setErr] = useState("");
  const confirm = useServerFn(confirmSimulatedDonation);

  function reset() {
    setStep("details");
    setPhone("");
    setErr("");
    onClose();
  }

  async function sendPrompt() {
    if (!/^0[235]\d{8}$/.test(phone)) {
      setErr("Enter a valid 10-digit Ghana number, e.g. 024 123 4567");
      return;
    }
    setErr("");
    setStep("prompt");
    await new Promise((r) => setTimeout(r, 2500));
    try {
      await confirm({ data: { reference } });
      setStep("success");
    } catch {
      setErr("Payment could not be confirmed. Try again.");
      setStep("details");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && reset()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md gap-0 overflow-hidden rounded-3xl p-0">
        <div className="bg-royal px-6 py-5 text-primary-foreground">
          <p className="eyebrow text-gold">Test payment</p>
          <DialogTitle className="mt-1 font-display text-2xl">GHS {amount.toLocaleString()}</DialogTitle>
          <DialogDescription className="text-sm text-primary-foreground/80">{email}</DialogDescription>
        </div>
        <div className="p-6">
          {step === "details" && (
            <div className="space-y-5">
              <div>
                <p className="font-label text-sm font-semibold">Choose network</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {NETWORKS.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNetwork(n.id)}
                      aria-pressed={network === n.id}
                      className={cn(
                        "rounded-xl border-2 px-2 py-3 text-xs font-bold font-label",
                        network === n.id ? "border-gold bg-gold-soft" : "border-border",
                      )}
                    >
                      {n.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="momo">Mobile money number</Label>
                <Input
                  id="momo"
                  inputMode="tel"
                  placeholder="024 123 4567"
                  className="mt-1.5 h-12 text-lg tracking-wide"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
                {err && <p className="mt-1 text-sm text-destructive">{err}</p>}
              </div>
              <Button onClick={sendPrompt} className="h-13 w-full rounded-xl py-3.5 text-base font-bold">
                Send payment prompt
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                This is a simulation — no money will be charged.
              </p>
            </div>
          )}
          {step === "prompt" && (
            <div className="py-6 text-center" role="status">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-gold" />
              <p className="mt-4 font-display text-xl font-bold">Check your phone</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Approve the prompt on {phone} and enter your MoMo PIN to complete.
              </p>
            </div>
          )}
          {step === "success" && (
            <div className="py-4 text-center" role="status">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-primary-foreground">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <p className="mt-4 font-display text-2xl font-bold">Thank you!</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your gift is lifting a young woman into leadership. Ref: <span className="font-mono">{reference}</span>
              </p>
              <Button onClick={reset} className="mt-6 h-12 w-full rounded-xl bg-gold text-gold-foreground hover:bg-gold/90">
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
