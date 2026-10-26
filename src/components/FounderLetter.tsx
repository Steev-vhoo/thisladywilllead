import founderPortrait from "@/assets/founder-portrait.jpg";
import { Reveal } from "@/components/Reveal";
import { VISION } from "@/lib/site";

export function FounderLetter() {
  return (
    <section className="bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-[2fr_3fr]">
        <Reveal className="mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-3xl bg-royal shadow-royal">
            <img
              src={founderPortrait}
              alt="Christine Opoku Onyinah Esq., Founder of This Lady Will"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <p className="mt-4 text-center font-display text-2xl font-bold text-primary">Christine Opoku Onyinah Esq.</p>
          <p className="eyebrow mt-1 text-center text-gold">Founder, This Lady Will</p>
        </Reveal>
        <Reveal>
          <p className="eyebrow text-gold">A letter from our founder</p>
          <h2 className="mt-2 text-4xl font-bold text-primary sm:text-5xl">Dear sister,</h2>
          <div className="mt-6 space-y-4 text-lg text-muted-foreground">
            <p>This Lady Will was born from a simple conviction: every young woman carries a God-given calling, and no one should have to discover it alone.</p>
            <p>Our vision is to keep {VISION.charAt(0).toLowerCase() + VISION.slice(1)}</p>
            <p>We build community, speak truth and practise boldness — so that you can dream, dare and do all that God has placed in your heart.</p>
          </div>
          <p className="mt-6 font-display text-xl italic text-primary">With love and faith,</p>
          <p className="mt-1 font-display text-lg font-bold text-primary">Christine Opoku Onyinah Esq.</p>
          <p className="eyebrow mt-1 text-muted-foreground">Founder, This Lady Will</p>
        </Reveal>
      </div>
    </section>
  );
}
