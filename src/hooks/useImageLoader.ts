import { useEffect, useState, type SyntheticEvent } from "react"

type UseImageLoaderProps ={
    onLoad?:(event:SyntheticEvent<HTMLImageElement>)=>void;
    onError?:(event:SyntheticEvent<HTMLImageElement>)=>void;
}

type UseImageLoaderReturnProps ={
    isLoading:boolean,
    isLoaded:boolean,
    hasError:boolean,
    handleLoad:(event:SyntheticEvent<HTMLImageElement>)=>void;
    handleError:(event:SyntheticEvent<HTMLImageElement>)=>void;
}

export function useImageLoader({
    onLoad,
    onError,
}:UseImageLoaderProps= {}):UseImageLoaderReturnProps{
    const [isLoading,setIsLoading] = useState(true)
    const [isLoaded,setIsLoaded] = useState(false)
    const [hasError,setHasError] = useState(false)

    const handleLoad = (event:SyntheticEvent<HTMLImageElement>)=>{
        console.log("Image Load Success", event.currentTarget.src)
        setIsLoading(false)
        setIsLoaded(true)
        setHasError(false)
        onLoad?.(event)
    }

    
    const handleError = (event:SyntheticEvent<HTMLImageElement>)=>{
        console.log("Image Error",event.currentTarget.src)
        setIsLoading(false)
        setHasError(true)
        onError?.(event)
    }

    return{
        isLoading,
        isLoaded,
        hasError,handleLoad,handleError
    }
}