import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

export function projectCardsReveal(element: HTMLElement) {
  const cards = element?.querySelectorAll<HTMLElement>(".project-card");

  const ctx = gsap.context(() => {
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 80,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none reverse",
        },
      },
    );
  }, element);

  return ctx;
}
