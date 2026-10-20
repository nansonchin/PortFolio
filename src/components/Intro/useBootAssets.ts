import { useEffect, useMemo, useState } from "react";
import { collectBootFiles } from "./bootScript";

const MAX_WAIT_MS = 5000;

const FONTS=[
    `400 1em "Instrument Serif"`,
    `400 1em "JetBrains Mono Variable"`,
    `400 1em "Inter Variable"`
]

export type BootAssets={
    files:string[];
    progress:number;
    ready:boolean;
}

export function useBootAssets():BootAssets{
    const files= useMemo(()=>collectBootFiles(),[])
    const [loadedCount,setLoadedCount] = useState(0)
    const [fontsReady,setFontsReady] = useState(false)
    const [ timedOut,setTimedOut] = useState(false)

    useEffect(()=>{
        let cancelled = false;
        files.forEach((src)=>{
            const image = new Image()

            const finish = (failed:boolean)=>{
                if(cancelled) return;
                setLoadedCount((count)=> count +1)
            }

            image.onload = ()=>finish(false);
            image.onerror= ()=>finish(true);
            image.src=src
        })

        Promise.all(FONTS.map((font)=>document.fonts.load(font))).catch(()=>{}).then(()=>{
            if(!cancelled) setFontsReady(true)
        })

        const timer = window.setTimeout(()=>{
            if(cancelled)return;
            setTimedOut(true)
        },MAX_WAIT_MS)

        return(()=>{
            cancelled = true;
            window.clearTimeout(timer)
        })
    },[files])

    const total = files.length+1;
    const done = loadedCount+(fontsReady?1:0)
    const rawProgress=Math.min(done/total,1)
    const ready = timedOut || rawProgress >=1


    return  {files,progress:ready?1:rawProgress,ready}
}