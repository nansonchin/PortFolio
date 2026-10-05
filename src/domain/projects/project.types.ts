export type ProjectCategory =
  | "Frontend"
  | "Backend"
  | "FullStack"
  | "Mobile"
  | "UI/UX"
  | "AI"
  | "Automation";

  export interface Project{
    id:string;
    slug:string;
    title:string;
    summary:string;
    description:string;
    year:number;
    category:ProjectCategory;
    featured:boolean;
    githubUrl:string;
    demoUrl?:string;
    thumbnail:string;
    technologies:string[]
  }