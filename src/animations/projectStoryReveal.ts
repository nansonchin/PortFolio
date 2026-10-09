import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProjectStoryRevealProps = {
  container: HTMLElement;
};

export function projectStoryReveal({ container }: ProjectStoryRevealProps) {
  const ctx = gsap.context(() => {
    const items = container.querySelectorAll(".story-item");

    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,

        scrollTrigger: {
          trigger: container,

          start: "top 75%",

          toggleActions: "play none none reverse",
        },
      },
    );
  }, container);

  return ctx;
}
