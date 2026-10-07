import { useEffect, useRef } from "react";

import CursorSvg from "./CursorSvg";
import CursorGlow from "./CursorGlow";
import { useCursor } from "../../hooks/useCursor";
import { createCursorVisualAnimation } from "../../animations/cursorAnimation";


function Cursor() {
  const cursorRef = useCursor();

  const glowRef = useRef<HTMLDivElement>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const cleanup = createCursorVisualAnimation({
      svg: svgRef.current,

      glow: glowRef.current,
    });

    return cleanup;
  }, []);

  return (
    <div
      ref={cursorRef}
      className=" fixed top-0 left-0 w-20 h-20 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 "
      aria-hidden="true"
    >
      <CursorGlow
        ref={glowRef}
        className=" absolute inset-0 rounded-full bg-[#FFDC22]/40 blur-xl"
      />

      <CursorSvg
        ref={svgRef}
        className=" absolute inset-0 text-[#FFDC22]"
      />
    </div>
  );
}

export default Cursor;


