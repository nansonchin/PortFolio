import type { ProjectGalleryImageModel } from "./ProjectGalleryImageModel";

export interface ProjectDetailModel{
    id:string;
    slug:string;
    title:string;
    description:string;
    year:number;
    category:string;
    heroImage:string;
    gallery:ProjectGalleryImageModel[];
    technologies:string[];
    features:string[];
    responsibilities:string[];
    challenges:string[];
    solutions:string[];
    githubUrl:string;
    demoUrl?:string;
}