import { useLayoutEffect } from "react";

import gsap from "gsap";

import { lightboxOpenAnimation } from "../animations/lightboxAnimation";

export function useLightboxAnimation(
  containerRef: React.RefObject<HTMLDivElement | null>,

  isOpen: boolean,
) {
  useLayoutEffect(() => {
    if (!containerRef.current || !isOpen) {
      return;
    }

    const ctx = gsap.context(() => {
      lightboxOpenAnimation({
        container: containerRef.current!,
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isOpen]);
}
