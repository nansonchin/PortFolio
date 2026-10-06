import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

type ProjectOverviewAnimationProps={
    container:HTMLElement
}

export function projectOverviewAnimation({
    container
}:ProjectOverviewAnimationProps){
    const ctx = gsap.context(() => {
      gsap.from(".overview-item", {
        opacity: 0,

        y: 60,

        duration: 1,

        stagger: 0.15,

        ease: "power3.out",

        scrollTrigger: {
          trigger: container,

          start: "top 80%",
        },
      });

      gsap.from(".gold-line", {
        width: 0,

        duration: 1.2,

        ease: "power3.out",

        scrollTrigger: {
          trigger: container,

          start: "top 80%",
        },
      });
    }, container);

    return ctx
}