import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

type ProjectHeroAnimationProps={
    containerRef:HTMLElement,
    titleRef:HTMLHeadingElement,
    imageRef:HTMLImageElement,
    glowRef:HTMLElement,
}

export function projectHeroAnimation ({
    containerRef,
    titleRef,
    imageRef,
    glowRef,
}:ProjectHeroAnimationProps){
    const ctx = gsap.context(() => {
      const revealTimeline = gsap.timeline();

      revealTimeline
        .from(".project-category", {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        })

        .from(
          titleRef,
          {
            opacity: 0,
            y: 80,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.4",
        )

        .from(
          ".project-description",
          {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5",
        )

        .from(
          ".project-actions",
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5",
        )

        .from(
          imageRef,
          {
            opacity: 0,
            scale: 1.15,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=0.8",
        );

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      scrollTimeline
        .to(imageRef, {
          scale: 1.2,
          y: 100,
          ease: "none",
        })

        .to(
          glowRef,
          {
            x: 120,
            y: 80,
            ease: "none",
          },
          0,
        );
    }, containerRef);
    return ctx;
}