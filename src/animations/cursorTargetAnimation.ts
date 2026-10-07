import gsap from "gsap";

type CursorTargetMode =
  | "default"
  | "view"
  | "code"
  | "live";

type CursorTargetAnimationProps = {
  svg: SVGSVGElement | null;
  mode: CursorTargetMode;
};

export function createCursorTargetAnimation({
  svg,
  mode,
}: CursorTargetAnimationProps) {
  if (!svg) {
    return;
  }

  const selectorMap = {
    view: ".cursor-target-view",
    code: ".cursor-target-code",
    live: ".cursor-target-live",
  };

  const selector =
    selectorMap[
      mode as keyof typeof selectorMap
    ];

  if (!selector) {
    return;
  }

  const target =
    svg.querySelector<SVGGElement>(selector);

  if (!target) {
    return;
  }

  const ctx = gsap.context(() => {
    gsap.set(target, {
      transformOrigin: "50% 50%",
    });

    /**
     * Initial lock-in.
     */
    gsap.fromTo(
      target,
      {
        opacity: 0.5,
        scale: 0.82,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.7)",
      }
    );

    /**
     * Continuous target breathing.
     */
    gsap.to(
      target,
      {
        scale:
          mode === "view"
            ? 1.035
            : mode === "code"
              ? 1.05
              : 1.04,

        duration:
          mode === "view"
            ? 1.8
            : mode === "code"
              ? 1.4
              : 1.6,

        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.35,
      }
    );
  }, svg);

  return () => {
    ctx.revert();
  };
}