import { Reveal } from "@/components/Reveal";

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <Reveal className="mb-10">
      <p className="eyebrow text-gold">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-black text-primary sm:text-5xl">{title}</h1>
      {children && <div className="mt-4 max-w-2xl text-lg text-muted-foreground">{children}</div>}
    </Reveal>
  );
}
