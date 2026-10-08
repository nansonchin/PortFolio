export type ResponsiveImage ={
    src:string;
    srcSet?:string;
    sizes?:string;
}

export type ImageSource = 
    | string
    | ResponsiveImage