import { UserRound } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { VISION } from "@/lib/site";

export function FounderLetter() {
  return (
    <section className="bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[2fr_3fr]">
        <Reveal className="mx-auto grid aspect-[4/5] w-full max-w-sm place-items-center rounded-3xl bg-royal text-center shadow-royal">
          <div>
            <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border-4 border-gold text-gold">
              <UserRound className="h-14 w-14" />
            </div>
            <p className="mt-5 font-display text-2xl font-bold text-primary-foreground">Our Founder</p>
            <p className="eyebrow mt-1 text-gold">Portrait coming soon</p>
          </div>
        </Reveal>
        <Reveal>
          <p className="eyebrow text-gold">A letter from our founder</p>
          <h2 className="mt-2 text-4xl font-bold text-primary sm:text-5xl">Dear sister,</h2>
          <div className="mt-6 space-y-4 text-lg text-muted-foreground">
            <p>This Lady Will was born from a simple conviction: every young woman carries a God-given calling, and no one should have to discover it alone.</p>
            <p>Our vision is to keep {VISION.charAt(0).toLowerCase() + VISION.slice(1)}</p>
            <p>We build community, speak truth and practise boldness — so that you can dream, dare and do all that God has placed in your heart.</p>
          </div>
          <p className="mt-6 font-display text-xl italic text-primary">With love and faith, — Founder, This Lady Will</p>
        </Reveal>
      </div>
    </section>
  );
}
