import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { z } from "zod";
import { verifyDonation } from "@/lib/donations.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/thank-you")({
  validateSearch: z.object({ reference: z.string().optional(), trxref: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Thank you for giving | This Lady Will" },
      { name: "description", content: "Your donation to This Lady Will is being confirmed." },
      { property: "og:title", content: "Thank you | This Lady Will" },
      { property: "og:description", content: "Your gift fuels the next generation of women leaders." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { reference, trxref } = Route.useSearch();
  const ref = reference ?? trxref;
  const verify = useServerFn(verifyDonation);
  const { data, isLoading } = useQuery({
    queryKey: ["verify", ref],
    queryFn: () => verify({ data: { reference: ref! } }),
    enabled: !!ref,
  });
  const status = data?.status;
  return (
    <section className="mx-auto max-w-lg px-5 py-24 text-center">
      {isLoading ? (
        <Clock className="mx-auto h-14 w-14 animate-pulse text-gold" />
      ) : status === "success" ? (
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
      ) : status === "pending" ? (
        <Clock className="mx-auto h-14 w-14 text-gold" />
      ) : (
        <XCircle className="mx-auto h-14 w-14 text-destructive" />
      )}
      <h1 className="mt-6 text-4xl font-bold text-primary">
        {isLoading ? "Confirming your gift…" : status === "success" ? "Thank you!" : status === "pending" ? "Payment pending" : "Payment not completed"}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {status === "success"
          ? "Your donation was confirmed. A receipt is on its way to your email."
          : status === "pending"
            ? "We'll update your donation as soon as your network confirms it."
            : !isLoading && "No money was taken. You can try again any time."}
      </p>
      <Button asChild className="mt-8 rounded-full px-8">
        <Link to="/">Back home</Link>
      </Button>
    </section>
  );
}
