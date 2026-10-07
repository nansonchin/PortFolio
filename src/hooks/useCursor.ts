import { useEffect, useRef } from "react";
import { createCursorMovement } from "../animations/cursorMovement";

export function useCursor(){
    const cursorRef = useRef<HTMLDivElement|null>(null)

    useEffect(()=>{
        const cursor = cursorRef.current

        if(!cursor){
            return
        }

        const movement = createCursorMovement(cursor)

        const handleMouseMove = (event:MouseEvent)=>{
            movement.move(event.clientX,event.clientY)
        }

        window.addEventListener("mousemove",handleMouseMove)

        return ()=>{
            window.removeEventListener("mousemove", handleMouseMove)
        }
    },[])

    return cursorRef
}