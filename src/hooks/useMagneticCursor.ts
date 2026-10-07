import { useEffect } from "react";

import {
  createCursorMagneticAnimation,
} from "../animations/cursorMagneticAnimation";

import {
  useCursorPhysics,
} from "../components/Cursor/CursorPhysicsContext";


export function useMagneticCursor() {

  const {
    setOffset,
  } = useCursorPhysics();


  useEffect(() => {

    const magnetic =
      createCursorMagneticAnimation({
        setOffset,
      });


    /**
     * Used to know whether
     * the Cursor is currently
     * inside a magnetic range.
     *
     * This prevents the release
     * animation from restarting
     * on every mousemove.
     */
    let isMagneticActive =
      false;


    const handleMouseMove = (
      event: MouseEvent,
    ) => {

      const targets =
        document.querySelectorAll<HTMLElement>(
          "[data-magnetic]",
        );


      let closestTarget:
        HTMLElement | null = null;


      let closestDistance =
        Infinity;


      /**
       * Find the closest
       * magnetic target.
       */
      for (const element of targets) {

        const rect =
          element.getBoundingClientRect();


        const centerX =
          rect.left +
          rect.width / 2;


        const centerY =
          rect.top +
          rect.height / 2;


        const distance =
          Math.hypot(
            event.clientX - centerX,
            event.clientY - centerY,
          );


        if (
          distance <
          closestDistance
        ) {

          closestDistance =
            distance;


          closestTarget =
            element;

        }

      }


      /**
       * No magnetic target exists.
       */
      if (!closestTarget) {

        if (isMagneticActive) {

          isMagneticActive =
            false;

          magnetic.reset();

        }

        return;

      }


      /**
       * Magnetic activation radius.
       */
      const radius =
        280;


      /**
       * Mouse is outside
       * the magnetic range.
       */
      if (
        closestDistance >
        radius
      ) {

        if (isMagneticActive) {

          isMagneticActive =
            false;

          magnetic.reset();

        }

        return;

      }


      /**
       * We are inside a
       * magnetic target.
       */
      isMagneticActive =
        true;


      const rect =
        closestTarget.getBoundingClientRect();


      const targetX =
        rect.left +
        rect.width / 2;


      const targetY =
        rect.top +
        rect.height / 2;


      /**
       * 0 = edge of range
       * 1 = target center
       */
      const strength =
        1 -
        closestDistance / radius;


      /**
       * Overall magnetic strength.
       */
      const pullStrength =
        2.35;


      const offsetX =
        (
          targetX -
          event.clientX
        )
        *
        strength
        *
        pullStrength;


      const offsetY =
        (
          targetY -
          event.clientY
        )
        *
        strength
        *
        pullStrength;


      magnetic.animateTo(
        offsetX,
        offsetY,
      );

    };


    window.addEventListener(
      "mousemove",
      handleMouseMove,
    );


    return () => {

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );


      magnetic.destroy();

    };

  }, [setOffset]);

}