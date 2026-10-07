import { createContext, useState, type ReactNode } from "react";

export type CursorMode = 
    | "default"
    | "view"
    | "code"
    | "live"

type CursorContextType ={
    mode: CursorMode;
    setMode:(
        mode:CursorMode
    )=>void;
}

export const CursorContext = createContext<CursorContextType|null>(null)

type CursorProviderProps ={
    children:ReactNode;
}

export function CursorProvider({
    children
}:CursorProviderProps){
    const [mode ,setMode] = useState<CursorMode>("default")

    return(
        <CursorContext.Provider value={{mode,setMode}}>
            {children}
        </CursorContext.Provider>
    )
}