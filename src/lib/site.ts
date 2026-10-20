import { HeartHandshake, GraduationCap, Compass } from "lucide-react";

export const MOTTO = "She Dreams. She Dares. She Does.";

export const PROGRAMS = [
  {
    slug: "mentorship-circles",
    name: "Mentorship Circles",
    icon: HeartHandshake,
    blurb: "Mentorship for young women becoming leaders, in community with other fellows.",
  },
  {
    slug: "leadership-academy",
    name: "Leadership Academy",
    icon: GraduationCap,
    blurb: "Leadership empowerment for young women ready to step forward and lead.",
  },
  {
    slug: "career-clarity",
    name: "Career Clarity",
    icon: Compass,
    blurb: "Support for young women defining their career aspirations and next steps.",
  },
] as const;

export type ProgramSlug = (typeof PROGRAMS)[number]["slug"];

export const DONATION_TIERS = [
  { id: "sister", label: "Support a Sister's Mentorship", amount: 150, cadence: "/mo", impact: "A monthly gift toward one young woman's mentorship." },
  { id: "cohort", label: "Cohort Sponsor", amount: 1000, cadence: "", impact: "Sponsor a cohort of fellows." },
] as const;

export const SOCIALS = {
  instagram: "https://instagram.com",
  x: "https://x.com",
  linkedin: "https://linkedin.com",
  facebook: "https://facebook.com",
};
