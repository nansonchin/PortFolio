import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { prefersReducedMotion } from "../../animations/glitch";

function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const { pathname } = useLocation();

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const curtain = curtainRef.current;
    if (!curtain) return;

    if (prefersReducedMotion()) return;

    gsap
      .timeline()
      .set(curtain, { autoAlpha: 1 })
      .to(curtain, {
        autoAlpha: 0,
        duration: 0.5,
        delay: 0.15,
        ease: "power2.in",
      });
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95000] bg-ink"
      style={{ opacity: 0, visibility: "hidden" }}
    />
  );
}

export default PageCurtain;