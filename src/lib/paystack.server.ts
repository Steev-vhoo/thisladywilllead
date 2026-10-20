const PAYSTACK_API = "https://api.paystack.co";

export function paystackKey(): string | undefined {
  const k = process.env["PAYSTACK_SECRET_KEY"]?.trim();
  return k ? k : undefined;
}

type VerifyResult = {
  status: boolean;
  data?: { status: string; amount: number; currency: string; reference: string; channel?: string };
};

export async function paystackInitialize(
  key: string,
  body: Record<string, unknown>,
): Promise<{ authorization_url: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url: string; reference: string };
  };
  if (!res.ok || !json.status || !json.data) {
    console.error("Paystack initialize failed", json.message);
    throw new Error("Could not start payment. Please try again.");
  }
  return json.data;
}

export async function paystackVerify(key: string, reference: string): Promise<VerifyResult> {
  const res = await fetch(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  return (await res.json()) as VerifyResult;
}

/**
 * Re-checks a transaction with Paystack and updates the stored donation.
 * The amount and currency must match what we stored at initialization.
 */
export async function reconcileDonation(reference: string): Promise<string> {
  const key = paystackKey();
  if (!key) return "pending";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: donation } = await supabaseAdmin
    .from("donations")
    .select("id, amount, currency, status")
    .eq("transaction_ref", reference)
    .maybeSingle();
  if (!donation) return "not_found";
  if (donation.status === "success") return "success";

  const result = await paystackVerify(key, reference);
  const tx = result.data;
  let status = "pending";
  if (tx) {
    const expected = Math.round(Number(donation.amount) * 100);
    if (tx.status === "success" && tx.amount === expected && tx.currency === donation.currency) {
      status = "success";
    } else if (tx.status === "failed" || tx.status === "abandoned") {
      status = tx.status;
    } else if (tx.status === "success") {
      status = "amount_mismatch";
    }
  }
  const method = tx?.channel === "card" ? "Card" : "MoMo";
  await supabaseAdmin
    .from("donations")
    .update({ status, payment_method: method })
    .eq("id", donation.id);
  return status;
}

export async function hmacSha512Hex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
