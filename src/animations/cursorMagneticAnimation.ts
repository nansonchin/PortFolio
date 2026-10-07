import gsap from "gsap";

type Point = {
  x: number;
  y: number;
};

type CursorMagneticAnimationProps = {
  setOffset: (x: number, y: number) => void;
};

export function createCursorMagneticAnimation({
  setOffset,
}: CursorMagneticAnimationProps) {
  const offset: Point = {
    x: 0,
    y: 0,
  };

  const tween = gsap.to(offset, {
    x: 0,
    y: 0,
    duration: 0.45,
    ease: "power3.out",
    paused: true,
    overwrite: "auto",

    onUpdate: () => {
      setOffset(offset.x, offset.y);
    },
  });

  const animateTo = (x: number, y: number) => {
    tween.vars.x = x;
    tween.vars.y = y;

    tween.invalidate();
    tween.restart();
  };

  const reset = () => {
    animateTo(0, 0);
  };

  const destroy = () => {
    tween.kill();

    setOffset(0, 0);
  };

  return {
    animateTo,
    reset,
    destroy,
  };
}
