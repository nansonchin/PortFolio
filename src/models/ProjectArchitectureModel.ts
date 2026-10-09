export type ArchitectureNode = {
    id:string;

    title:string;

    description?:string;

    children?:ArchitectureNode[];
};


export type ProjectArchitectureModel = {

    title:string;

    description:string;

    root:ArchitectureNode;

};  