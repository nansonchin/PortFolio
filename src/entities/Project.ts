export interface Project {
  id: string;

  slug: string;

  title: string;

  summary: string;

  description: string;

  year: number;

  featured: boolean;

  category: string;

  githubUrl: string;

  demoUrl?: string;

  thumbnail: string;

  technologies: string[];

  heroImage: string;

  gallery: string[];

  features: string[];

  responsibilities: string[];

  challenges: string[];

  solutions: string[];
}
