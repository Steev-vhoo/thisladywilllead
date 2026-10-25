import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const PHRASES = ["She Dreams.", "She Dares.", "She Does."];
// step durations in ms: 3 phrases (1.6s each), full motto (3.7s), fade gap
const STEPS = [1600, 1600, 1600, 3700, 400];

export function HeroTagline() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), STEPS[step]);
    return () => clearTimeout(t);
  }, [step]);
  return (
    <div className="relative h-24 sm:h-20" aria-label="She Dreams. She Dares. She Does." role="text">
      <AnimatePresence mode="wait">
        {step < 3 && (
          <motion.p key={step} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 font-display text-4xl font-bold text-gold sm:text-5xl" aria-hidden>
            {PHRASES[step]}
          </motion.p>
        )}
        {step === 3 && (
          <motion.p key="all" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 font-display text-3xl font-black text-gold drop-shadow-[0_0_18px_var(--gold)] sm:text-4xl" aria-hidden>
            She Dreams. She Dares. She Does.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const IMAGES = [
  { src: hero1, alt: "Young African woman leader smiling" },
  { src: hero2, alt: "Young women in a mentorship circle" },
  { src: hero3, alt: "Young woman speaking at a podium" },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-royal sm:aspect-[4/3] lg:aspect-[4/5]">
      <AnimatePresence initial={false}>
        <motion.img key={i} src={IMAGES[i]!.src} alt={IMAGES[i]!.alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1 }} animate={{ opacity: 1, scale: 1.08 }} exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 }, scale: { duration: 6, ease: "linear" } }} />
      </AnimatePresence>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {IMAGES.map((_, n) => (
          <button key={n} aria-label={`Show image ${n + 1}`} onClick={() => setI(n)}
            className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-gold" : "w-2 bg-primary-foreground/60"}`} />
        ))}
      </div>
    </div>
  );
}
