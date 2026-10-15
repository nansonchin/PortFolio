import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

export type IntroPhase = "booting" | "revealing" | "done"

const STORAGE_KEY="portfolio-intro-seen";

type IntroContextValue={
    phase:IntroPhase;
    startReveal:()=>void;
    completeIntro:()=>void;
}


export const IntroContext = createContext<IntroContextValue | null> (null)

function getInitialPhase():IntroPhase{
    if(typeof window ==="undefined"){
        return "done"
    }

    try{
        const params = new URLSearchParams(window.location.search)

        if(params.has("intro")){
            return "booting"
        }
        const seen = sessionStorage.getItem(STORAGE_KEY) === "1"
        const isHome = window.location.pathname === "/"

        return seen || !isHome? "done" : "booting"
    }catch{
        return "done"
    }
}

export function IntroProvider ({children}:{children:ReactNode}){
    const [phase, setPhase] = useState<IntroPhase>(getInitialPhase)

    const startReveal = useCallback(()=>{
        setPhase((current)=>(current === "booting"?"revealing":current))
    },[])

    const completeIntro = useCallback(()=>{
        try{
            // sessionStorage.setItem(STORAGE_KEY,"1")
        }catch{

        }
        setPhase("done")
    },[])

    const value = useMemo(
        ()=>({phase,startReveal,completeIntro}),
        [phase, startReveal,completeIntro]
    )

    return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
}

