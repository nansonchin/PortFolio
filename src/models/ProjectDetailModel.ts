import type { ProjectArchitectureModel } from "./ProjectArchitectureModel";
import type { ProjectGalleryImageModel } from "./ProjectGalleryImageModel";
import type { ProjectStoryModel } from "./ProjectStoryModel";
import type { ResponsiveImage } from "./ResponsiveImage";

export interface ProjectDetailModel{
    id:string;
    slug:string;
    title:string;
    description:string;
    year:number;
    category:string;
    heroImage:ResponsiveImage;
    gallery:ProjectGalleryImageModel[];
    technologies:string[];
    features:string[];
    responsibilities:string[];
    challenges:string[];
    solutions:string[];
    githubUrl:string;
    demoUrl?:string;
    story:ProjectStoryModel;
    architecture?:ProjectArchitectureModel;
}