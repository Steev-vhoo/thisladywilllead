import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import heroMentoring from "@/assets/hero-mentoring.jpg";
import heroSharing from "@/assets/hero-sharing.jpg";
import heroWorkshop from "@/assets/hero-workshop.jpg";
import heroTeam from "@/assets/hero-team.jpg";

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
            className="absolute inset-0 font-label text-4xl font-bold tracking-tight text-gold sm:text-5xl" aria-hidden>
            {PHRASES[step]}
          </motion.p>
        )}
        {step === 3 && (
          <motion.p key="all" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 font-label text-2xl font-bold tracking-tight text-gold drop-shadow-[0_0_18px_var(--gold)] sm:text-[1.75rem]" aria-hidden>
            She Dreams. She Dares.<br className="sm:hidden" /> She Does.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// Photos from This Lady Will gatherings (credit: @miphotographer). `position` keeps the subject in
// frame when cropped; `contain` shows the whole group photo over a blurred copy instead of cropping.
const IMAGES: { src: string; alt: string; position?: string; contain?: boolean }[] = [
  { src: heroMentoring, alt: "A mentor leans in to guide a young woman during a This Lady Will workshop", position: "55% 30%" },
  { src: heroSharing, alt: "A young woman speaks into a microphone beside vision boards at a This Lady Will session", position: "50% 40%" },
  { src: heroWorkshop, alt: "Young women working on vision boards in front of the This Lady Will backdrop", position: "52% 50%" },
  { src: heroTeam, alt: "Seven women from the This Lady Will community at a sponsored event", contain: true },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  // Restarts on every change, so tapping a dot gets a full 5s before auto-advancing.
  useEffect(() => {
    const t = setTimeout(() => setI((x) => (x + 1) % IMAGES.length), 5000);
    return () => clearTimeout(t);
  }, [i]);
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-royal sm:aspect-[4/3] lg:aspect-[4/5]">
      <AnimatePresence initial={false}>
        <motion.div key={i} className="absolute inset-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
          {IMAGES[i]!.contain && (
            <img src={IMAGES[i]!.src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-75" />
          )}
          <motion.img src={IMAGES[i]!.src} alt={IMAGES[i]!.alt}
            className={`absolute inset-0 h-full w-full ${IMAGES[i]!.contain ? "object-contain" : "object-cover"}`}
            style={{ objectPosition: IMAGES[i]!.position ?? "center" }}
            initial={{ scale: 1 }} animate={{ scale: IMAGES[i]!.contain ? 1 : 1.08 }}
            transition={{ duration: 6, ease: "linear" }} />
        </motion.div>
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
