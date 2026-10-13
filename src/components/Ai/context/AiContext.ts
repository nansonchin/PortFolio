    import type { ProjectArchitectureModel } from "../../../models/ProjectArchitectureModel";

    export interface DeveloperContext{
        name:string;
        role:string;
        description:string,
        background:string[];
        skills:string[];
        goals:string[]
    }

    export interface ProjectAiContext{
        id:string;
        title:string;
        summary:string;
        description:string;
        category:string;
        year:number;
        slug:string,
        featured:boolean,
        technologies:string[];
        features:string[];
        responsibilities:string[];
        challenges:string[];
        solutions:string[];
        githubUrl?:string;
        demoUrl?:string
        architecture?:ProjectArchitectureModel
    }

    export interface PortfolioContext{
        developer:DeveloperContext;
        projects:ProjectAiContext[];
    }