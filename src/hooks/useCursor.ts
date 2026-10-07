import { useEffect } from "react";

import { createCursorMovement } from "../animations/cursorMovement";

import { createCursorVelocityAnimation } from "../animations/cursorVelocityAnimation";

import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

export function useCursor(cursorRef: React.RefObject<HTMLDivElement | null>) {
  const physics = useCursorPhysics();

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    /**
     * Smooth cursor position.
     */
    const movement = createCursorMovement(cursor);

    /**
     * Cursor velocity response.
     */
    const velocity = createCursorVelocityAnimation({
      cursor,
    });

    /**
     * Previous mouse position.
     */
    let previousX = 0;

    let previousY = 0;

    /**
     * Previous timestamp.
     */
    let previousTime = 0;

    /**
     * Prevent velocity calculation
     * before the first mouse event.
     */
    let hasPreviousPosition = false;

    /**
     * Render Cursor using the
     * final Physics position.
     */
    const updateCursor = () => {
      const position = physics.getPosition();

      movement.move(position.x, position.y);
    };

    /**
     * Real mouse movement.
     */
    const handleMouseMove = (event: MouseEvent) => {
      const currentX = event.clientX;

      const currentY = event.clientY;

      const currentTime = performance.now();

      /**
       * Update actual mouse
       * position in Physics.
       */
      physics.setMousePosition(currentX, currentY);

      /**
       * First mouse event.
       *
       * We only store the position.
       */
      if (!hasPreviousPosition) {
        previousX = currentX;

        previousY = currentY;

        previousTime = currentTime;

        hasPreviousPosition = true;

        velocity.reset();

        return;
      }

      /**
       * Calculate time difference.
       *
       * Protect against extremely
       * small or zero delta time.
       */
      const deltaTime = Math.max(currentTime - previousTime, 1);

      /**
       * Mouse movement in pixels.
       */
      const deltaX = currentX - previousX;

      const deltaY = currentY - previousY;

      /**
       * Convert to pixels / second.
       */
      const velocityX = (deltaX / deltaTime) * 1000;

      const velocityY = (deltaY / deltaTime) * 1000;

      velocity.update(velocityX, velocityY);

      /**
       * Save current values
       * for the next frame.
       */
      previousX = currentX;

      previousY = currentY;

      previousTime = currentTime;
    };

    /**
     * Keep Cursor position
     * synchronized with Physics.
     *
     * This includes:
     *
     * - Mouse position
     * - Magnetic offset
     */
    const unsubscribe = physics.subscribe(updateCursor);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      unsubscribe();

      window.removeEventListener("mousemove", handleMouseMove);

      velocity.destroy();
    };
  }, [physics]);
}
