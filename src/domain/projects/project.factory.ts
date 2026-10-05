import type { Project } from "./project.types";

export type CreateProjectInput = Project

export function createProject(
    project:CreateProjectInput
):Project{
    return{
        ...project
    }
}