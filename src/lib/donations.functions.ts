import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { paystackInitialize, paystackKey, reconcileDonation } from "./paystack.server";

export const donationSchema = z.object({
  donor_name: z.string().trim().min(2, "Please enter your name").max(100),
  donor_email: z.string().trim().email("Enter a valid email").max(255),
  amount: z.number().min(10, "Minimum donation is GHS 10").max(100000),
  method: z.enum(["MoMo", "Card"]),
});

export const initializeDonation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => donationSchema.parse(d))
  .handler(async ({ data }) => {
    const key = paystackKey();
    const reference = `TLW-${key ? "" : "SIM-"}${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("donations").insert({
      donor_name: data.donor_name,
      donor_email: data.donor_email,
      amount: data.amount,
      currency: "GHS",
      payment_method: data.method,
      transaction_ref: reference,
      status: "pending",
    });
    if (error) {
      console.error(error);
      throw new Error("Could not record donation. Please try again.");
    }

    if (!key) return { mode: "simulated" as const, reference, authorization_url: null };

    const origin = new URL(getRequest().url).origin;
    const tx = await paystackInitialize(key, {
      email: data.donor_email,
      amount: Math.round(data.amount * 100),
      currency: "GHS",
      reference,
      callback_url: `${origin}/thank-you`,
      channels: data.method === "MoMo" ? ["mobile_money"] : ["card"],
      metadata: { donor_name: data.donor_name },
    });
    return { mode: "live" as const, reference, authorization_url: tx.authorization_url };
  });

export const verifyDonation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ reference: z.string().min(5).max(80) }).parse(d))
  .handler(async ({ data }) => {
    const status = await reconcileDonation(data.reference);
    return { status };
  });

/** Test mode only: confirms a simulated MoMo payment when no Paystack key is configured. */
export const confirmSimulatedDonation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ reference: z.string().startsWith("TLW-SIM-").max(80) }).parse(d),
  )
  .handler(async ({ data }) => {
    if (paystackKey()) throw new Error("Simulation disabled");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("donations")
      .update({ status: "success" })
      .eq("transaction_ref", data.reference)
      .eq("status", "pending");
    return { status: "success" };
  });
