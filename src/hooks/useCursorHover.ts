import { useEffect } from "react";
import { useCursorContext } from "./useCursorContext";

export function useCursorHover() {
  const { setMode } = useCursorContext();

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const cursorElement = target.closest(
        "[data-cursor]",
      ) as HTMLElement | null;

      if (!cursorElement) {
        return;
      }

      const mode = cursorElement.dataset.cursor;

      if (mode === "view" || mode === "code" || mode === "live") {
        setMode(mode);
      }
    };

    const handleMouseOut = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const cursorElement = target.closest(
        "[data-cursor]",
      ) as HTMLElement | null;

      if (!cursorElement) {
        return;
      }

      setMode("default");
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  },[setMode]);
}
