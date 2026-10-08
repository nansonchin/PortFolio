import { projects } from "../data/project";
import type { Project } from "../entities/Project";
import type { ProjectStat } from "../models/ProjectStatsModel";

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

    getStats():ProjectStat[]{
        const technologies = new Set<string>()

        projects.forEach(
            project=>{
                project.technologies.forEach(
                    tech=>{
                        technologies.add(tech)
                    }
                )
            }
        )

        return[
            {
                label:"Projects",
                value:`${projects.length}`
            },
            {
                label:"Technologies",
                value:`${technologies.size}+`
            },
            {
                label:"Featured",
                value:`${
                    projects.filter(project=>project.featured).length
                }`
            }
        ]
    }
}

export const projectRepository = new ProjectRepository()