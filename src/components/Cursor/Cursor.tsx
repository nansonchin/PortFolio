import { useEffect, useRef } from "react";

import CursorSvg from "./CursorSvg";
import CursorGlow from "./CursorGlow";
import CursorLabel from "./CursorLabel";

import { useCursor } from "../../hooks/useCursor";
import { useCursorContext } from "../../hooks/useCursorContext";
import { useCursorHover } from "../../hooks/useCursorHover";
import { useMagneticCursor } from "../../hooks/useMagneticCursor";
import { useCursorClick } from "../../hooks/useCursorClick";

import { createCursorVisualAnimation } from "../../animations/cursorAnimation";
import { createCursorStateAnimation } from "../../animations/cursorStateAnimation";


function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { mode } = useCursorContext();

  useCursor(cursorRef);
  useCursorHover();
  useMagneticCursor();
  useCursorClick();

  useEffect(() => {
    const cleanup = createCursorVisualAnimation({
      svg: svgRef.current,
      glow: glowRef.current,
    });

    return cleanup;
  }, []);

  useEffect(() => {
    const animation = createCursorStateAnimation({
      cursor: cursorRef.current,
      glow: glowRef.current,
    });

    if (!animation) {
      return;
    }

    if (mode === "view") {
      animation.setView();
    } else {
      animation.setDefault();
    }
  }, [mode]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-20 h-20 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <CursorGlow
        ref={glowRef}
        className="absolute inset-0 rounded-full bg-[#FFDC22]/40 blur-xl"
      />

      <CursorSvg
        ref={svgRef}
        mode={mode}
        className="absolute inset-2 text-[#FFDC22]"
      />

      <CursorLabel />
    </div>
  );
}

export default Cursor;