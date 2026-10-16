import gsap from "gsap";

type CursorClickAnimationProps = {
  svg: SVGSVGElement | null;
};

export function createCursorClickAnimation({ svg }: CursorClickAnimationProps) {
  if (!svg) return;

  const pulseRing = svg.querySelector<SVGElement>(".cursor-click-ring");
  if (!pulseRing) return;

  gsap.set(pulseRing, { transformOrigin: "50% 50%", transformBox: "fill-box" });

  const trigger = () => {
    gsap.killTweensOf(pulseRing);
    gsap.set(pulseRing, { scale: 0.6, opacity: 0.9 });
    gsap.to(pulseRing, {
      scale: 2.3,
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
      overwrite: "auto",
    });

    const core = svg.querySelector<SVGElement>(".cursor-core");
    if (core) {
      gsap.killTweensOf(core);
      gsap.set(core, { transformOrigin: "50% 50%", transformBox: "fill-box" });
      gsap.fromTo(
        core,
        { scale: 1 },
        { scale: 1.6, duration: 0.12, ease: "power2.out", yoyo: true, repeat: 1, overwrite: "auto" },
      );
    }
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    trigger();
  };

  document.addEventListener("pointerdown", handlePointerDown);

  return () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    gsap.killTweensOf(pulseRing);
  };
}