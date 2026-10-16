import { useEffect } from "react";
import gsap from "gsap";
import { createCursorMovement } from "../animations/cursorMovement";
import { createCursorVelocityAnimation } from "../animations/cursorVelocityAnimation";
import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const ACTIVE_CLASS = "custom-cursor-active";

export function useCursor(cursorRef: React.RefObject<HTMLDivElement | null>) {
  const physics = useCursorPhysics();

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const media = window.matchMedia(FINE_POINTER);
    const root = document.documentElement;
    const movement = createCursorMovement(cursor);
    const velocity = createCursorVelocityAnimation({ cursor });

    // 第一次鼠标事件之前保持隐藏
    gsap.set(cursor, { autoAlpha: 0 });

    let isVisible = false;
    let hasPreviousPosition = false;
    let previousX = 0;
    let previousY = 0;
    let previousTime = 0;

    const show = () => {
      if (isVisible) return;
      isVisible = true;
      gsap.to(cursor, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
    };

    const hide = () => {
      isVisible = false;
      hasPreviousPosition = false;
      velocity.reset();
      gsap.to(cursor, { autoAlpha: 0, duration: 0.15, overwrite: "auto" });
    };

    const syncMode = () => {
      if (media.matches) {
        root.classList.add(ACTIVE_CLASS);
      } else {
        root.classList.remove(ACTIVE_CLASS);
        hide();
      }
    };

    syncMode();
    media.addEventListener("change", syncMode);

    const updateCursor = () => {
      const position = physics.getPosition();
      movement.move(position.x, position.y);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!media.matches) return;

      const currentX = event.clientX;
      const currentY = event.clientY;
      const currentTime = performance.now();

      if (!isVisible) {
        movement.jumpTo(currentX, currentY);
        show();
      }

      physics.setMousePosition(currentX, currentY);

      if (!hasPreviousPosition) {
        previousX = currentX;
        previousY = currentY;
        previousTime = currentTime;
        hasPreviousPosition = true;
        velocity.reset();
        return;
      }

      const deltaTime = Math.max(currentTime - previousTime, 1);
      velocity.update(
        ((currentX - previousX) / deltaTime) * 1000,
        ((currentY - previousY) / deltaTime) * 1000,
      );

      previousX = currentX;
      previousY = currentY;
      previousTime = currentTime;
    };

    const handleLeave = () => hide();

    const unsubscribe = physics.subscribe(updateCursor);
    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      unsubscribe();
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      media.removeEventListener("change", syncMode);
      root.classList.remove(ACTIVE_CLASS);
      velocity.destroy();
    };
  }, [physics, cursorRef]);
}