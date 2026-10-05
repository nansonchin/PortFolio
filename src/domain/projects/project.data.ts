import { createProject } from "./project.factory";
import type { Project } from "./project.types";

const projects: Project[] = [
  createProject({
    id: "manga-reader",
    slug: "manga-reader",
    title: "Manga Reader",
    summary: "A high-performance manga reader build with React Query",
    description:
      "A React project using TanStack Query, infinite scrolling, image preloading, virtualized rendering, and the MangaDex Api",
    year: 2026,
    category: "Frontend",
    featured: true,
    githubUrl: "https://github.com/nansonchin/manga-webReactQuery",
    demoUrl: "",
    thumbnail: "../../assets/projects/mangaReader",
    technologies: [
      "React",
      "TypeScript",
      "TanStack Query",
      "GSAP",
      "SCSS",
      "Vite",
    ],
  }),
  createProject({
    id: "portfolio",

    slug: "portfolio",

    title: "Developer Portfolio",

    summary: "A modern portfolio inspired by Awwwards using React and GSAP.",

    description:
      "A portfolio website featuring premium animations, reusable architecture, AI chatbot integration, GitHub synchronization and responsive design.",

    year: 2026,

    category: "Frontend",

    featured: true,

    githubUrl: "https://github.com/your-github/portfolio",

    demoUrl: "",
    thumbnail: "../../assets/projects/mangaReader",
    technologies: ["React", "TypeScript", "GSAP", "Tailwind CSS", "Lenis"],
  }),
];

export function getProjects(): Project[] {
  return projects;
}
