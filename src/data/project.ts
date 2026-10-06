import type { Project } from "../entities/Project";

export const projects: Project[] = [
  {
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
    heroImage: "../../assets/projects/mangaReader",
    technologies: [
      "React",
      "TypeScript",
      "TanStack Query",
      "GSAP",
      "SCSS",
      "Vite",
    ],

    gallery: [
      "/images/projects/manga-reader/1.webp",
      "/images/projects/manga-reader/2.webp",
    ],
    features: [
      "Infinite Chapter Loading",
      "Optimized Image Rendering",
      "Reader Performance System",
    ],
    responsibilities: [
      "Frontend Architecture",
      "API Integration",
      "Performance Optimization",
    ],
    challenges: [
      "Handling large manga images",
      "Reducing unnecessary network requests",
    ],
    solutions: ["React Query caching", "Browser image cache strategy"],
  },
  {
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
    heroImage: "../../assets/projects/mangaReader",
    technologies: ["React", "TypeScript", "GSAP", "Tailwind CSS", "Lenis"],
    gallery: [
      "/images/projects/manga-reader/1.webp",
      "/images/projects/manga-reader/2.webp",
    ],
    features: [
      "Infinite Chapter Loading",
      "Optimized Image Rendering",
      "Reader Performance System",
    ],
    responsibilities: [
      "Frontend Architecture",
      "API Integration",
      "Performance Optimization",
    ],
    challenges: [
      "Handling large manga images",
      "Reducing unnecessary network requests",
    ],
    solutions: ["React Query caching", "Browser image cache strategy"],
  },
];
