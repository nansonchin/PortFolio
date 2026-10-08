import { useCallback } from "react"
import { preloadImage } from "../utils/preloadImage"
import type { ImageSource } from "../models/ResponsiveImage"

export function useImagePreload(){
    const  preload = useCallback(
        (src:ImageSource)=>{
            preloadImage(src).catch((error)=>{
                console.error(error)
            })
        },
        []
    )

    return preload
}