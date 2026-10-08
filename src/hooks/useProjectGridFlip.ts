import { useRef } from "react";
import { Flip } from "gsap/Flip";
import { projectGridFlipAnimation } from "../animations/projectGridFlipAnimation";

export function useProjectGridFlip() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const captureFlip = () => {
    const container = containerRef.current;

    if (!container) return null;

    const cards = container.querySelectorAll<HTMLElement>(
      "[data-flip-card]"
    );

    console.log("CAPTURE", cards.length);

    return Flip.getState(cards);
  };

  const playFlip = (state: Flip.FlipState | null) => {
    if (!state) return;

    console.log("PLAY");

    return projectGridFlipAnimation(state);
  };

  return {
    containerRef,
    captureFlip,
    playFlip,
  };
}