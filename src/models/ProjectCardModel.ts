import type { ResponsiveImage } from "./ResponsiveImage";

export interface ProjectCardModel{
    id:string;
    slug:string;
    title:string;
    summary:string;
    category:string;
    thumbnail:string;
    heroImage:ResponsiveImage,
    technologies:string[],
    githubUrl:string,
    demoUrl?:string,
}