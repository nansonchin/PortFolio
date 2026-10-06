import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import type { Project } from "../entities/Project"

gsap.registerPlugin(ScrollTrigger)

type ProjectGalleryAnimationProps ={
    container:HTMLElement
}

export function projectGalleryAnimation({
    container
}:ProjectGalleryAnimationProps){
    const ctx = gsap.context(()=>{
        gsap.from(".gallery-header",{
            opacity:0,
            y:60,
            duration:1,
            ease:"power3.out",
            scrollTrigger:{
                trigger:container,
                start:"top 80%"
            }
        })

        gsap.from(".gallery-item",{
            opacity:0,
            y:80,
            duration:1,
            stagger:0.25,
            ease:'power3.out',
            scrollTrigger:{
                trigger:container,
                start:"top 70%"
            }
        })

        gsap.utils.toArray<HTMLElement>(".gallery-image").forEach((image)=>{
            gsap.to(image,{
                y:-40,
                ease:'none',
                scrollTrigger:{
                    trigger:image,
                    start:"top bottom",
                    end:"bottom top",
                    scrub:true,
                }
            })
        })
    },container)

    return ctx
}