import {useGSAP} from "@gsap/react"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import type { RefObject } from "react";
import { prefersReducedMotion } from "../animations/glitch";

gsap.registerPlugin(ScrollTrigger)

export function  useFrameParallax(scopeRef:RefObject<HTMLElement|null>){
    useGSAP(
        ()=>{
            const scope = scopeRef.current
            if(!scope || prefersReducedMotion()) return;

            const images = gsap.utils.toArray<HTMLElement>(".frame-parallax",scope)

            images.forEach((image)=>{
                gsap.fromTo(
                    image,
                    {yPercent:-5},
                    {
                        yPercent:5,
                        ease:"none",
                        scrollTrigger:{
                            trigger:image.closest("[data-frame]")??image,
                            start:"top bottom",
                            end:"bottom top",
                            scrub:true,
                        }
                    }
                )
            })
        },{
            scope:scopeRef
        }
    )
}