import {
    useEffect,
    useRef
} from "react";


export function useTerminalScroll(
    dependency:any
){

    const containerRef =
        useRef<HTMLDivElement>(null);


    useEffect(()=>{

        const container =
            containerRef.current;


        if(!container){
            return;
        }


        container.scrollTop =
            container.scrollHeight;


    },[dependency]);


    return containerRef;

}