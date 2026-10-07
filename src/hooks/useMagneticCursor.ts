import { useEffect } from "react";

import { createCursorMagneticAnimation } from "../animations/cursorMagneticAnimation";

import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

export function useMagneticCursor() {
  const { setOffset } = useCursorPhysics();

  useEffect(() => {
    const magnetic = createCursorMagneticAnimation({
      setOffset,
    });

    const handleMouseMove = (event: MouseEvent) => {
      const targets = document.querySelectorAll<HTMLElement>("[data-magnetic]");

      let closestTarget: HTMLElement | null = null;

      let closestDistance = Infinity;

      for (const element of targets) {
        const rect = element.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;

        const centerY = rect.top + rect.height / 2;

        const distance = Math.hypot(
          event.clientX - centerX,
          event.clientY - centerY,
        );

        if (distance < closestDistance) {
          closestDistance = distance;

          closestTarget = element;
        }
      }

      /**
       * No magnetic target
       */
      if (!closestTarget) {
        magnetic.reset();

        return;
      }

      /**
       * Magnetic activation radius
       */
      const radius = 300;

      /**
       * Outside magnetic range
       */
      if (closestDistance > radius) {
        magnetic.reset();

        return;
      }

      const rect = closestTarget.getBoundingClientRect();

      const targetX = rect.left + rect.width / 2;

      const targetY = rect.top + rect.height / 2;

      /**
       * 0 = edge of magnetic range
       * 1 = center of target
       */
      const strength = 1 - closestDistance / radius;

      /**
       * Magnetic pull strength
       */
      const pullStrength = 1.8;

      const offsetX = (targetX - event.clientX) * strength * pullStrength;

      const offsetY = (targetY - event.clientY) * strength * pullStrength;

      magnetic.animateTo(offsetX, offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      magnetic.destroy();
    };
  }, [setOffset]);
}
