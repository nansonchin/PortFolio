import gsap from "gsap";


type CursorPoint = {
  x: number;
  y: number;
};


type CursorMagneticAnimationProps = {
  setOffset: (
    x: number,
    y: number
  ) => void;
};


export function createCursorMagneticAnimation({
  setOffset,
}: CursorMagneticAnimationProps) {

  const offset: CursorPoint = {
    x: 0,
    y: 0,
  };


  /**
   * Push the current animated
   * offset into Cursor Physics.
   */
  const updateOffset = () => {

    setOffset(
      offset.x,
      offset.y,
    );

  };


  /**
   * One reusable tween.
   *
   * We reuse this tween for both:
   *
   * magnetic attraction
   * release animation
   */
  const tween = gsap.to(
    offset,
    {
      x: 0,
      y: 0,

      duration: 0.35,

      ease: "power3.out",

      paused: true,

      overwrite: "auto",

      onUpdate: updateOffset,
    },
  );


  /**
   * Move Cursor toward
   * the magnetic target.
   */
  const animateTo = (
    x: number,
    y: number,
  ) => {

    tween.vars.x = x;

    tween.vars.y = y;

    tween.vars.duration = 0.35;

    tween.vars.ease = "power3.out";


    tween.invalidate();

    tween.restart();

  };


  /**
   * Release the magnetic force.
   *
   * The Cursor slightly overshoots
   * before settling back to zero.
   */
  const reset = () => {

    tween.vars.x = 0;

    tween.vars.y = 0;

    tween.vars.duration = 0.5;

    tween.vars.ease = "back.out(1.7)";


    tween.invalidate();

    tween.restart();

  };


  /**
   * Cleanup.
   */
  const destroy = () => {

    tween.kill();

    setOffset(
      0,
      0,
    );

  };


  return {
    animateTo,
    reset,
    destroy,
  };

}