import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../animations/glitch";

gsap.registerPlugin(ScrollTrigger);

export function useReveal(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const elements = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);

      if (elements.length === 0 || prefersReducedMotion()) return;

      gsap.set(elements, { autoAlpha: 0, y: 36 });

      ScrollTrigger.batch(elements, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            overwrite: true,
          });
        },
      });
    },
    { scope: scopeRef },
  );
}