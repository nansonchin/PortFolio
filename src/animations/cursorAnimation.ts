import gsap from "gsap";

type CursorVisualAnimationProps = {
  glow: HTMLDivElement | null;
};

export function createCursorVisualAnimation({ glow }: CursorVisualAnimationProps) {
  if (!glow) return;

  const ctx = gsap.context(() => {
    gsap.to(glow, {
      scale: 1.25,
      opacity: 0.55,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return () => {
    ctx.revert();
  };
}