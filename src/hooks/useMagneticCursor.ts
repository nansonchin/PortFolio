import { useEffect } from "react";
import { createCursorMagneticAnimation } from "../animations/cursorMagneticAnimation";
import { useCursorPhysics } from "../components/Cursor/CursorPhysicsContext";

const PULL = 0.3;       
const MAX_OFFSET = 14;   

export function useMagneticCursor() {
  const { setOffset } = useCursorPhysics();

  useEffect(() => {
    const magnetic = createCursorMagneticAnimation({ setOffset });

    let isActive = false;
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;
    let hasMoved = false;

    const release = () => {
      if (isActive) {
        isActive = false;
        magnetic.reset();
      }
    };

    const evaluate = () => {
      frame = 0;

      const element = document.elementFromPoint(mouseX, mouseY);
      const target =
        element && !element.closest("[data-cursor-ignore]")
          ? element.closest<HTMLElement>("[data-magnetic]")
          : null;

      if (!target) {
        release();
        return;
      }

      const rect = target.getBoundingClientRect();
      let offsetX = (rect.left + rect.width / 2 - mouseX) * PULL;
      let offsetY = (rect.top + rect.height / 2 - mouseY) * PULL;

      // 规则 3：像素上限
      const length = Math.hypot(offsetX, offsetY);
      if (length > MAX_OFFSET) {
        const scale = MAX_OFFSET / length;
        offsetX *= scale;
        offsetY *= scale;
      }

      isActive = true;
      magnetic.animateTo(offsetX, offsetY);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      hasMoved = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
      schedule();
    };

    const handleScroll = () => {
      if (hasMoved) schedule();
    };

    const handleLeave = () => release();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      if (frame) cancelAnimationFrame(frame);
      magnetic.destroy();
    };
  }, [setOffset]);
}