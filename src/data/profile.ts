export type SkillGroup = {
  title: string;
  items: string[];
};

export type Profile = {
  headline: string[];
  intro: string[];
  location: string;
  status: string;
  email: string;
  github: string;
  linkedin: string;
  focus: string[];
  skillGroups: SkillGroup[];
};

export const profile: Profile = {
  headline: ["I try builded interfaces", "I try to study design"],
  intro: [
    "I' m a frontend developer with an IT diploma and a little background in UI/UX design. I like about thespace between design and engineering:  interfaces that are fast, well structured.",
    "Late I've been combining  React, TypeScript and GSAP with AI integration. This portfolio is the proof of concept: visitors can simply ask JARVIS to take them anywhere",
  ],
  location: "",
  status: "Open",
  email: "",
  github: "https://github.com/nansonchin",
  linkedin: "",
  focus: ["React", "TypeScript", "Vue", "AI Integration"],

  skillGroups: [
    {
      title: "Frontend",
      items: ["React", "TypeScript", "Vue", "Tailwind CSS", "SCSS"],
    },
    {
      title: "Motion",
      items: ["GSAP", "ScrollTrigger", "Lenis", "Interaction design"],
    },
    {
      title: "Data & Tooling",
      items: ["TanStack Query", "Vite", "Git", "REST APIs"],
    },
    { title: "AI", items: ["Gemini API", "Function calling", "Prompt design"] },
  ],
};

export type ContactLink = {
  label: string;
  href: string;
  display: string;
  external: boolean;
  cursor: "view" | "code";
};

const stripProtocol = (url: string) =>
  url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export function getContactLinks(): ContactLink[] {
  const links: ContactLink[] = [];

  links.push({
    label: "EMAIL",
    href: "",
    display: profile.email,
    external: false,
    cursor: "view",
  });

  links.push({
    label: "GITHUB",
    href: profile.github,
    display: stripProtocol(profile.github),
    external: true,
    cursor: "code",
  });

  links.push({
    label: "LINKEDIN",
    href: "",
    display: stripProtocol(profile.linkedin),
    external: true,
    cursor: "view",
  });

  return links;
}
