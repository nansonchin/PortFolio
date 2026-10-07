import gsap from "gsap";

type CursorIdleAnimationProps = {
  visual: HTMLDivElement;
};

export function createCursorIdleAnimation({
  visual,
}: CursorIdleAnimationProps) {
  /**
   * Idle only controls the
   * Visual Wrapper.
   *
   * It does NOT directly touch:
   *
   * - SVG
   * - Glow
   * - Rotation
   * - Glow breathing
   *
   * This prevents Idle from
   * killing other animations.
   */

  const enterIdle = () => {
    gsap.to(visual, {
      scale: 0.78,
      opacity: 0.7,
      filter: "brightness(0.55)",
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const exitIdle = () => {
    gsap.to(visual, {
      scale: 1,
      opacity: 1,
      filter: "brightness(1)",
      duration: 0.35,
      ease: "back.out(1.4)",
      overwrite: "auto",
    });
  };

  const destroy = () => {
    /**
     * Only kill tweens belonging
     * to the Visual Wrapper.
     */
    gsap.killTweensOf(visual, "scale,opacity");
  };

  return {
    enterIdle,
    exitIdle,
    destroy,
  };
}
