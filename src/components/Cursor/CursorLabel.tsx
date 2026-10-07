import { useEffect, useRef } from "react";

import { useCursorContext } from "../../hooks/useCursorContext";

import { createCursorLabelAnimation } from "../../animations/cursorLabelAnimation";

import { cursorVisualConfig } from "./cursorVisualConfig";

type CursorLabelProps = {
  isIdle?: boolean;
};

function CursorLabel({ isIdle = false }: CursorLabelProps) {
  const { mode } = useCursorContext();

  const labelRef = useRef<HTMLDivElement>(null);

  const visual = cursorVisualConfig[mode];

  useEffect(() => {
    const element = labelRef.current;

    if (!element) {
      return;
    }

    const animation = createCursorLabelAnimation({
      element,
    });

    if (!animation) {
      return;
    }

    /**
     * Idle has its own label.
     *
     * Even if the Cursor is
     * currently over a target,
     * Standby takes priority.
     */
    const shouldShow = isIdle || mode !== "default";

    if (shouldShow) {
      animation.show();
    } else {
      animation.hide();
    }
  }, [mode, isIdle]);

  const labels = {
    view: "VIEW",
    code: "CODE",
    live: "LIVE",
  };

  const text = isIdle
    ? "STANDBY"
    : mode === "default"
      ? ""
      : labels[mode];

  return (
    <div
      ref={labelRef}
      className={`
        absolute
        left-1/2
        top-full
        mt-3
        -translate-x-1/2
        pointer-events-none
        text-xs
        tracking-[0.25em]
        font-medium
        uppercase
        whitespace-nowrap
        opacity-0
        ${visual.labelClassName}
      `}
    >
      {text}
    </div>
  );
}

export default CursorLabel;
