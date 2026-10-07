import { useEffect } from "react";

import { createCursorMovement } from "../animations/cursorMovement";

import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

export function useCursor(cursorRef: React.RefObject<HTMLDivElement | null>) {
  const physics = useCursorPhysics();

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const movement = createCursorMovement(cursor);

    const updateCursor = () => {
      const position = physics.getPosition();

      movement.move(
        position.x,

        position.y,
      );
    };

    const handleMouseMove = (event: MouseEvent) => {
      physics.setMousePosition(
        event.clientX,

        event.clientY,
      );
    };

    const unsubscribe = physics.subscribe(updateCursor);

    window.addEventListener(
      "mousemove",

      handleMouseMove,
    );

    return () => {
      unsubscribe();

      window.removeEventListener(
        "mousemove",

        handleMouseMove,
      );
    };
  }, [physics]);
}
