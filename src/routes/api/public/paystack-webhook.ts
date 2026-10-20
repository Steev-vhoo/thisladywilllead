import { createFileRoute } from "@tanstack/react-router";
import { hmacSha512Hex, paystackKey, reconcileDonation, safeEqual } from "@/lib/paystack.server";

export const Route = createFileRoute("/api/public/paystack-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = paystackKey();
        if (!key) return new Response("Not configured", { status: 503 });
        const raw = await request.text();
        const signature = request.headers.get("x-paystack-signature") ?? "";
        const expected = await hmacSha512Hex(key, raw);
        if (!signature || !safeEqual(signature, expected)) {
          return new Response("Invalid signature", { status: 401 });
        }
        let event: { event?: string; data?: { reference?: string } };
        try {
          event = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }
        const ref = event.data?.reference;
        if (ref && typeof ref === "string" && ref.length < 100 && event.event?.startsWith("charge.")) {
          // Never trust the payload amount: re-verify with Paystack's API.
          await reconcileDonation(ref);
        }
        return new Response("ok");
      },
    },
  },
});
