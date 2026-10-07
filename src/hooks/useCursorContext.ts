import { useContext } from "react";
import { CursorContext } from "../components/Cursor/CursorContext";

export function useCursorContext(){
    const context  = useContext(CursorContext)

    if(!context){
        throw new Error("useCursorContext must be used inside Cursor  Provider")
    }

    return context
}