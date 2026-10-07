import { useEffect, useRef } from "react";

import { useCursorContext } from "../../hooks/useCursorContext";
import { createCursorLabelAnimation } from "../../animations/cursorLabelAnimation";

function CursorLabel() {
  const { mode } = useCursorContext();

  const labelRef = useRef<HTMLDivElement>(null);

  const cursorLabels = {
    view: "VIEW",
    code: "CODE",
    live: "LIVE",
  };

  useEffect(() => {
    const element = labelRef.current;

    if (!element) {
      return;
    }

    const animation = createCursorLabelAnimation({
      element,
    });

    if (mode === "default") {
      animation.hide();
    } else {
      animation.show();
    }
  }, [mode]);

  const text = mode === "default" ? "" : cursorLabels[mode];

  return (
    <div
      ref={labelRef}
      className=" absolute left-1/2 top-full mt-3 -translate-x-1/2 text-sm tracking-[0.3em] 
      font-medium text-yellow-400 uppercase whitespace-nowrap opacity-0"
    >
      {text}
    </div>
  );
}

export default CursorLabel;
