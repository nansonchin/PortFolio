import type { ImageSource, ResponsiveImage } from "../models/ResponsiveImage";

function resolveImageSource(
    image: ImageSource
): ResponsiveImage {

    if(typeof image === "string"){
        return {
            src:image,
        };
    }

    return image;
}


export function preloadImage(
    image: ImageSource
){

    const resolvedImage = resolveImageSource(image);

    return new Promise<void>((resolve,reject)=>{

        const img = new Image();

        img.src = resolvedImage.src;

        img.onload = ()=>{
            resolve();
        };

        img.onerror = ()=>{
            reject(
                new Error(
                    `Failed to preload image: ${resolvedImage.src}`
                )
            );
        };

    });

}