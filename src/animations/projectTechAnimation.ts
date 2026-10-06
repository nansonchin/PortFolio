import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger)

type ProjectTechAnimationProps={
    container:HTMLElement
}

export function projectTechAnimation({
    container
}:ProjectTechAnimationProps){
const ctx = gsap.context(() => {
      gsap.from(".tech-item", {
        opacity: 0,

        y: 60,

        duration: 0.8,

        stagger: 0.12,

        ease: "power3.out",

        scrollTrigger: {
          trigger: container,

          start: "top 80%",
        },
      });
    }, container);

    return ctx
}