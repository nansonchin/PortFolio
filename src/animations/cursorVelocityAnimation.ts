import gsap from "gsap";


type CursorVelocityAnimationProps = {
  cursor: HTMLDivElement;
};


export function createCursorVelocityAnimation({
  cursor,
}: CursorVelocityAnimationProps) {

  /**
   * Keep rotation within a small range.
   */
  const rotationTo =
    gsap.quickTo(
      cursor,
      "rotation",
      {
        duration: 0.2,
        ease: "power3.out",
      },
    );


  /**
   * Vertical movement creates
   * a very small horizontal skew.
   */
  const skewXTo =
    gsap.quickTo(
      cursor,
      "skewX",
      {
        duration: 0.2,
        ease: "power3.out",
      },
    );


  /**
   * Horizontal movement creates
   * a very small vertical skew.
   */
  const skewYTo =
    gsap.quickTo(
      cursor,
      "skewY",
      {
        duration: 0.2,
        ease: "power3.out",
      },
    );


  /**
   * Update the visual response
   * from mouse velocity.
   *
   * velocity is measured in px / second.
   */
  const update = (
    velocityX: number,
    velocityY: number,
  ) => {

    /**
     * Rotation is mainly controlled
     * by horizontal movement.
     */
    const rotation =
      Math.max(
        -10,
        Math.min(
          10,
          velocityX / 150,
        ),
      );


    /**
     * Vertical movement produces
     * a subtle skew.
     */
    const skewX =
      Math.max(
        -6,
        Math.min(
          6,
          velocityY / 250,
        ),
      );


    const skewY =
      Math.max(
        -6,
        Math.min(
          6,
          -velocityX / 300,
        ),
      );


    rotationTo(rotation);

    skewXTo(skewX);

    skewYTo(skewY);

  };


  /**
   * Return Cursor to neutral state.
   */
  const reset = () => {

    rotationTo(0);

    skewXTo(0);

    skewYTo(0);

  };


  /**
   * Cleanup only the properties
   * owned by this animation.
   */
  const destroy = () => {

    gsap.killTweensOf(
      cursor,
      "rotation,skewX,skewY",
    );

  };


  return {
    update,
    reset,
    destroy,
  };
}