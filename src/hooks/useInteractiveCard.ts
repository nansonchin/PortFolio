import gsap from "gsap"
import { useRef } from "react"

export function useInteractiveCard(){
    const cardRef= useRef<HTMLElement | null>(null)
    const handleMouseMove=(event:React.MouseEvent<HTMLElement>)=>{
        const card =cardRef.current;
        if(!card){
            return
        }
        const rect = card.getBoundingClientRect()
        const mouseX=event.clientX-rect.left
        const mouseY=event.clientY-rect.top;


        card.style.setProperty("--mouse-x",`${mouseX}px`)
        card.style.setProperty("--mouse-y",`${mouseY}px`)

        const rotateY=(mouseX/rect.width - 0.5) * 20;
        const rotateX=(mouseY/rect.height - 0.5) *20

        gsap.to(
            card,
            {
                rotateX,
                rotateY,
                duration:0.5,
                ease:"power3.out",
                transformPerspective:1000,
                overwrite:true,
            }
        )
    }

    const handleMouseLeave=()=>{

        const card = cardRef.current;
        if(!card){
            return
        }

        gsap.to(card,{
            rotateX:0,
            rotateY:0,
            duration:0.8,
            ease:"power3.out",
            overwrite:true,
        })
    }

    return{
        cardRef, handleMouseLeave,handleMouseMove
    }
}