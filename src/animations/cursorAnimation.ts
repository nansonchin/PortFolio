import gsap from "gsap";

type CursorVisualAnimationProps = {
  svg: SVGSVGElement | null;

  glow: HTMLDivElement | null;
};

export function createCursorVisualAnimation({
  svg,

  glow,
}: CursorVisualAnimationProps) {
  if (!svg || !glow) {
    return;
  }

  const ctx = gsap.context(() => {
    /**
     * SVG HUD Rotation
     */
    gsap.set(svg, {
      transformOrigin: "center center",
    });

    gsap.to(svg, {
      rotate: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
    });

    /**
     * Glow Breathing
     */
    gsap.to(glow, {
      scale: 1.25,
      opacity: 0.55,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    /**
     * Floating HUD Motion
     */
    gsap.to(svg, {
      y: -4,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return () => {
    ctx.revert();
  };
}
