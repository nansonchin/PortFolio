export interface ProjectCardModel{
    id:string;
    slug:string;
    title:string;
    summary:string;
    category:string;
    thumbnail:string;
    technologies:string[],
    githubUrl:string,
    demoUrl?:string,
}