import { useEffect, useRef } from "react";

import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

import { useCursorContext } from "./useCursorContext";

export function useCursorHover() {
  const { setMode } = useCursorContext();

  const { getPosition, subscribe } = useCursorPhysics();

  const currentMode = useRef<string>("default");

  useEffect(() => {
    const updateCursorHover = () => {
      const { x, y } = getPosition();

      const element = document.elementFromPoint(x, y);

      const cursorElement = element?.closest(
        "[data-cursor]",
      ) as HTMLElement | null;

      const mode = cursorElement?.dataset.cursor;

      const nextMode =
        mode === "view" || mode === "code" || mode === "live"
          ? mode
          : "default";

      if (currentMode.current === nextMode) {
        return;
      }

      currentMode.current = nextMode;

      setMode(nextMode);
    };

    /**
     * Initial check
     */
    updateCursorHover();

    /**
     * Update whenever
     * cursor physics changes.
     *
     * This includes:
     *
     * mouse movement
     * magnetic offset
     */
    const unsubscribe = subscribe(updateCursorHover);

    return () => {
      unsubscribe();
    };
  }, [getPosition, subscribe, setMode]);
}
