import { HeartHandshake, GraduationCap, Compass } from "lucide-react";

export const PROGRAMS = [
  {
    slug: "mentorship-circles",
    name: "Mentorship Circles",
    icon: HeartHandshake,
    duration: "6 months · small groups of 8",
    blurb:
      "Monthly circles pairing you with a seasoned woman leader and a sisterhood that keeps you accountable.",
    points: ["1:1 mentor check-ins", "Peer accountability pods", "Confidence & voice labs"],
  },
  {
    slug: "leadership-academy",
    name: "Leadership Academy",
    icon: GraduationCap,
    duration: "12 weeks · hybrid",
    blurb:
      "An intensive curriculum on public speaking, strategic thinking, community organising and ethical leadership.",
    points: ["Weekly masterclasses", "Capstone community project", "Certificate of completion"],
  },
  {
    slug: "career-clarity",
    name: "Career Clarity",
    icon: Compass,
    duration: "8 weeks · virtual",
    blurb:
      "Map your purpose, sharpen your CV and practise interviews with women already thriving in your dream field.",
    points: ["Strengths assessment", "CV & LinkedIn rebuild", "Mock interviews"],
  },
] as const;

export type ProgramSlug = (typeof PROGRAMS)[number]["slug"];

export const DONATION_TIERS = [
  {
    id: "sister",
    label: "Support a Sister's Mentorship",
    amount: 150,
    cadence: "/mo",
    impact: "Covers one fellow's monthly mentorship circle, materials and transport.",
  },
  {
    id: "cohort",
    label: "Cohort Sponsor",
    amount: 1000,
    cadence: "",
    impact: "Funds a full Leadership Academy workshop for an entire cohort.",
  },
] as const;

export const TEAM = [
  { name: "Christine Opoku Onyinah", role: "Founder & Lead Mentor", initials: "CO" },
  { name: "Abena Owusu", role: "Programs Director", initials: "AO" },
  { name: "Dr. Esi Mensah", role: "Leadership Academy Faculty", initials: "EM" },
  { name: "Naa Adjeley Tetteh", role: "Career Clarity Coach", initials: "NT" },
  { name: "Yaa Asantewaa Boateng", role: "Community Lead", initials: "YB" },
  { name: "Selasi Agbeko", role: "Mentor, Fintech", initials: "SA" },
];

export const SOCIALS = {
  instagram: "https://instagram.com",
  x: "https://x.com",
  linkedin: "https://linkedin.com",
  facebook: "https://facebook.com",
};
