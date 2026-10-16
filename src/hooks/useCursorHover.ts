import { useEffect } from "react";
import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";
import { useCursorContext } from "./useCursorContext";
import type { CursorMode } from "../components/Cursor/CursorContext";

export function useCursorHover() {
  const { setMode } = useCursorContext();
  const { getMousePosition } = useCursorPhysics();

  useEffect(() => {
    let currentMode: CursorMode = "default";
    let frame = 0;
    let hasMoved = false;

    const check = () => {
      frame = 0;
      const { x, y } = getMousePosition();          
      const element = document.elementFromPoint(x, y);
      let nextMode: CursorMode = "default";

      if (element && !element.closest("[data-cursor-ignore]")) {
        const mode = (element.closest("[data-cursor]") as HTMLElement | null)
          ?.dataset.cursor;
        if (mode === "view" || mode === "code" || mode === "live") {
          nextMode = mode;
        }
      }

      if (nextMode === currentMode) return;
      currentMode = nextMode;
      setMode(nextMode);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    const handleMouseMove = () => {
      hasMoved = true;
      schedule();
    };

    const handleScroll = () => {
      if (hasMoved) schedule();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [getMousePosition, setMode]);
}