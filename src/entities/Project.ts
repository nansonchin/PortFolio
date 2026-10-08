import type { ProjectGalleryImageModel } from "../models/ProjectGalleryImageModel";
import type { ResponsiveImage } from "../models/ResponsiveImage";

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

  heroImage: ResponsiveImage;

  gallery: ProjectGalleryImageModel[];

  features: string[];

  responsibilities: string[];

  challenges: string[];

  solutions: string[];
}
