import { HeartHandshake, GraduationCap, Compass } from "lucide-react";

export const MOTTO = "She Dreams. She Dares. She Does.";
export const VISION =
  "Walking with young women as they grow into their God-given calling—becoming confident, becoming whole, and becoming all that God has called them to be.";
export const PILLARS = [
  { name: "Community", text: "Sisterhood that walks with you through every season." },
  { name: "Truth", text: "Rooted in faith, honest about who we are and who we are becoming." },
  { name: "Boldness", text: "Courage to dream, dare and do what God has placed in our hearts." },
] as const;

export const CONTACT = {
  email: "thisladywill@gmail.com",
  phone: "+233 00 000 0000",
  whatsapp: "https://wa.me/233000000000",
  location: "Accra, Ghana",
};

export const PROGRAMS = [
  {
    slug: "mentorship-circles",
    name: "Mentorship Circles",
    icon: HeartHandshake,
    focus: "Faith, identity, and personal development",
    blurb: "Faith, identity, and personal development — in sisterhood with mentors who walk with you.",
  },
  {
    slug: "leadership-academy",
    name: "Leadership Academy",
    icon: GraduationCap,
    focus: "Executive skills, governance, and public leadership",
    blurb: "Executive skills, governance, and public leadership for young women ready to lead boldly.",
  },
  {
    slug: "career-clarity",
    name: "Career Clarity",
    icon: Compass,
    focus: "Professional pathways, enterprise, and vocational excellence",
    blurb: "Professional pathways, enterprise, and vocational excellence aligned with your calling.",
  },
] as const;

export type ProgramSlug = (typeof PROGRAMS)[number]["slug"];

export const DONATION_TIERS = [
  { id: "sister", label: "Support a Sister's Mentorship", amount: 150, cadence: "/mo", impact: "A monthly gift toward one young woman's mentorship journey." },
  { id: "workshop", label: "Leadership Academy Workshop Sponsor", amount: 500, cadence: "", impact: "Sponsor a Leadership Academy workshop." },
  { id: "cohort", label: "Cohort Champion & Resource Sponsor", amount: 1000, cadence: "", impact: "Champion a cohort and fund its resources." },
] as const;

const SHARE = encodeURIComponent("This Lady Will — She Dreams. She Dares. She Does. https://thisladywilllead.lovable.app");
export const SOCIALS = {
  instagram: "https://www.instagram.com/thisladywill",
  x: `https://twitter.com/intent/tweet?text=${SHARE}`,
  linkedin: "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fthisladywilllead.lovable.app",
  facebook: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fthisladywilllead.lovable.app",
  whatsapp: CONTACT.whatsapp,
};
