import type { Project } from "../entities/Project";
import type { ProjectCardModel } from "../models/ProjectCardModel";
import type { ProjectDetailModel } from "../models/ProjectDetailModel";

export function toProjectCardModel(project: Project): ProjectCardModel {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    thumbnail: project.thumbnail,
    heroImage:project.heroImage,
    technologies: project.technologies,
    category:project.category,
    githubUrl:project.githubUrl,
    demoUrl:project.demoUrl,
  };
}

export function toProjectDetailModel(project: Project): ProjectDetailModel {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    year: project.year,
    category: project.category,
    heroImage: project.heroImage,
    gallery: project.gallery,
    technologies: project.technologies,
    features: project.features,
    responsibilities: project.responsibilities,
    challenges: project.challenges,
    solutions: project.solutions,
    githubUrl: project.githubUrl,
    demoUrl: project.demoUrl,
  };
}
