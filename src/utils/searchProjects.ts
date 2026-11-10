import { projects } from "../data/project";
import { projectRepository } from "../repository/ProjectRepository";

export function searchProjects(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const serachTerm = normalizedQuery.split(/\s+/);

  return projectRepository.getAll().filter((project) => {
    const searchableText = [
      project.id,
      project.slug,
      project.title,
      project.category,
      project.summary,
      project.description,
      ...project.technologies,
    ]
      .join(" ")
      .toLowerCase();

    return serachTerm.every((term) => searchableText.includes(term));
  });
}
