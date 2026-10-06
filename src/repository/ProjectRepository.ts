import { projects } from "../data/project";
import type { Project } from "../entities/Project";

export class ProjectRepository{
    getAll():Project[]{
        return projects
    }

    getFeatures():Project[]{
        return projects.filter(
            project=>project.featured
        )
    }
    getBySlug(slug:string):Project|undefined{
        return projects.find(project=>project.slug===slug)
    }

    getById(id:string):Project|undefined{
        return projects.find(
            project=>project.id === id
        )
    }
}

export const projectRepository = new ProjectRepository()