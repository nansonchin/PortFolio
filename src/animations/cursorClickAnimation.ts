import gsap from "gsap";


type CursorClickAnimationProps = {
  svg: SVGSVGElement | null;
};


export function createCursorClickAnimation({
  svg,
}: CursorClickAnimationProps) {

  if (!svg) {
    return;
  }


  const pulseRing =
    svg.querySelector<SVGCircleElement>(
      ".cursor-click-ring",
    );


  const core =
    svg.querySelector<SVGCircleElement>(
      ".cursor-core",
    );


  if (!pulseRing) {
    return;
  }


  /**
   * Keep the pulse centered
   * around the Cursor.
   */
  gsap.set(
    pulseRing,
    {
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    },
  );


  if (core) {

    gsap.set(
      core,
      {
        transformOrigin: "50% 50%",
        transformBox: "fill-box",
      },
    );

  }


  const trigger =
    () => {

      /**
       * Restart pulse cleanly
       * when user clicks rapidly.
       */
      gsap.killTweensOf(
        pulseRing,
      );


      gsap.set(
        pulseRing,
        {
          scale: 0.6,
          opacity: 0.9,
        },
      );


      gsap.to(
        pulseRing,
        {
          scale: 2.3,
          opacity: 0,

          duration: 0.45,

          ease: "power2.out",

          overwrite: "auto",
        },
      );


      /**
       * Small center-dot feedback.
       */
      if (core) {

        gsap.killTweensOf(
          core,
        );


        gsap.fromTo(
          core,
          {
            scale: 1,
          },
          {
            scale: 1.6,

            duration: 0.12,

            ease: "power2.out",

            yoyo: true,

            repeat: 1,

            overwrite: "auto",
          },
        );

      }

    };


  /**
   * Listen to real left-click /
   * pointer activation.
   */
  const handlePointerDown = (
    event: PointerEvent,
  ) => {

    if (
      event.button !== 0
    ) {
      return;
    }


    trigger();

  };


  document.addEventListener(
    "pointerdown",
    handlePointerDown,
  );


  return () => {

    document.removeEventListener(
      "pointerdown",
      handlePointerDown,
    );


    gsap.killTweensOf(
      pulseRing,
    );


    if (core) {

      gsap.killTweensOf(
        core,
      );

    }

  };
}