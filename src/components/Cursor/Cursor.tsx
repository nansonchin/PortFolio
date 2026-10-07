import {
  useEffect,
  useRef,
} from "react";


import CursorSvg from "./CursorSvg";
import CursorGlow from "./CursorGlow";
import CursorLabel from "./CursorLabel";


import {
  cursorVisualConfig,
} from "./cursorVisualConfig";


import {
  useCursor,
} from "../../hooks/useCursor";


import {
  useCursorContext,
} from "../../hooks/useCursorContext";


import {
  useCursorHover,
} from "../../hooks/useCursorHover";


import {
  useMagneticCursor,
} from "../../hooks/useMagneticCursor";


import {
  useCursorClick,
} from "../../hooks/useCursorClick";


import {
  useCursorIdle,
} from "../../hooks/useCursorIdle";


import {
  createCursorVisualAnimation,
} from "../../animations/cursorAnimation";


import {
  createCursorStateAnimation,
} from "../../animations/cursorStateAnimation";


import {
  createCursorTargetAnimation,
} from "../../animations/cursorTargetAnimation";


import {
  createCursorClickAnimation,
} from "../../animations/cursorClickAnimation";


function Cursor() {

  const cursorRef =
    useRef<HTMLDivElement>(null);


  const visualRef =
    useRef<HTMLDivElement>(null);


  const glowRef =
    useRef<HTMLDivElement>(null);


  const svgRef =
    useRef<SVGSVGElement>(null);


  const {
    mode,
  } = useCursorContext();


  const visual =
    cursorVisualConfig[mode];


  useCursor(cursorRef);

  useCursorHover();

  useMagneticCursor();

  useCursorClick();


  /**
   * Idle State.
   *
   * Only scales the Visual Wrapper.
   *
   * It does NOT directly control
   * SVG or Glow.
   */
  const isIdle =
    useCursorIdle({
      visualRef,

      idleDelay: 1200,
    });


  /**
   * Permanent Visual Animation.
   *
   * Keeps:
   *
   * - SVG rotation
   * - Glow breathing
   */
  useEffect(() => {

    const cleanup =
      createCursorVisualAnimation({
        svg: svgRef.current,

        glow: glowRef.current,
      });


    return cleanup;

  }, []);


  /**
   * Cursor State Animation.
   *
   * Handles:
   *
   * - Default
   * - View
   * - Code
   * - Live
   */
  useEffect(() => {

    const animation =
      createCursorStateAnimation({
        cursor: cursorRef.current,

        glow: glowRef.current,
      });


    if (!animation) {
      return;
    }


    if (mode === "view") {

      animation.setView();

    }

    else if (mode === "code") {

      animation.setCode();

    }

    else if (mode === "live") {

      animation.setLive();

    }

    else {

      animation.setDefault();

    }

  }, [mode]);


  /**
   * Target Lock Animation.
   *
   * Handles the shape entrance
   * for View / Code / Live.
   */
  useEffect(() => {

    const cleanup =
      createCursorTargetAnimation({
        svg: svgRef.current,

        mode,
      });


    return cleanup;

  }, [mode]);


  /**
   * Click Pulse.
   *
   * Runs once.
   */
  useEffect(() => {

    const cleanup =
      createCursorClickAnimation({
        svg: svgRef.current,
      });


    return cleanup;

  }, []);


  return (
    <div
      ref={cursorRef}
      className="
        fixed
        top-0
        left-0
        w-20
        h-20
        pointer-events-none
        z-[9999]
        -translate-x-1/2
        -translate-y-1/2
      "
      aria-hidden="true"
    >

      {/*
        Visual Wrapper

        Idle controls this layer.

        Glow and SVG animations
        continue independently.
      */}
      <div
        ref={visualRef}
        className="
          absolute
          inset-0
        "
      >

        <CursorGlow
          ref={glowRef}
          className={`
            absolute
            inset-0
            rounded-full
            blur-xl
            ${visual.glowClassName}
          `}
        />


        <CursorSvg
          ref={svgRef}
          mode={mode}
          className={`
            absolute
            inset-2
            ${visual.svgClassName}
          `}
        />

      </div>


      {/*
        Label stays outside the
        Visual Wrapper.

        Therefore STANDBY READY
        does not get scaled down.
      */}
      <CursorLabel
        isIdle={isIdle}
      />

    </div>
  );
}


export default Cursor;