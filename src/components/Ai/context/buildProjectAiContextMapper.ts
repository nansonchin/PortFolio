import { projectRepository } from "../../../repository/ProjectRepository";
import type { ProjectAiContext } from "./AiContext";

export function buildProjectContext():ProjectAiContext[]{
    return projectRepository.getAll().map(project=>({
        id:project.id,
        title:project.title,
        summary:project.summary,
        category:project.category,
        slug:project.slug,
        featured:project.featured,
        description:project.description,
        year:project.year,
        technologies:project.technologies,
        features:project.features,
        responsibilities:project.responsibilities,
        challenges:project.challenges,
        solutions:project.solutions,
        architecture:project.architecture
    }))
}