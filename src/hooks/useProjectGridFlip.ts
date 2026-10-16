import { useRef } from "react";
import { Flip } from "gsap/Flip";
import { projectGridFlipAnimation } from "../animations/projectGridFlipAnimation";
import { prefersReducedMotion } from "../animations/glitch";

export function useProjectGridFlip() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const captureFlip = () => {
    const container = containerRef.current;

    if (!container || prefersReducedMotion()) return null;

    const cards = container.querySelectorAll<HTMLElement>(
      "[data-flip-card]"
    );

    if(cards.length===0){
      return null
    }

    Flip.killFlipsOf(cards)

    return Flip.getState(cards);
  };

  const playFlip = (state: Flip.FlipState | null) => {
    if (!state) return;

    return projectGridFlipAnimation(state);
  };

  return {
    containerRef,
    captureFlip,
    playFlip,
  };
}