import { useEffect, useRef } from "react";

import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

export function useCursorClick() {
  const { getPosition } = useCursorPhysics();
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    const handleClickCapture = (event: MouseEvent) => {
      if (isRedirectingRef.current) {
        return;
      }

      const { x, y } = getPosition();

      const element = document.elementFromPoint(x, y) as HTMLElement | null;

      if (!element) {
        return;
      }

      const clickableTarget = element.closest(
        'a, button, [data-cursor], [role="button"]',
      ) as HTMLElement | null;

      if (!clickableTarget) {
        return;
      }

      const originalTarget = event.target as Node | null;

      /**
       * If the real mouse click already hit the same element,
       * let the browser handle it normally.
       */
      if (clickableTarget === originalTarget) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      isRedirectingRef.current = true;

      try {
        clickableTarget.click();
      } finally {
        window.setTimeout(() => {
          isRedirectingRef.current = false;
        }, 0);
      }
    };

    document.addEventListener("click", handleClickCapture, true);

    return () => {
      document.removeEventListener("click", handleClickCapture, true);
    };
  }, [getPosition]);
}
