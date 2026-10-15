import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCursorPhysics } from "../Cursor/CursorPhysicsContext";
import { prefersReducedMotion } from "../../animations/glitch";

const FOLLOW_STRENGTH = 0.8; 
function GoldLight() {
  const lightRef = useRef<HTMLDivElement>(null);
  const { getPosition, subscribe } = useCursorPhysics();

  useEffect(() => {
    const light = lightRef.current;
    const section = light?.parentElement;

    if (!light || !section || prefersReducedMotion()) return;

    const moveX = gsap.quickTo(light, "x", {
      duration: 1.4,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(light, "y", {
      duration: 1.4,
      ease: "power3.out",
    });

    const update = () => {
      const rect = section.getBoundingClientRect();

      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const { x, y } = getPosition();

      moveX((x - rect.left - rect.width / 2) * FOLLOW_STRENGTH);
      moveY((y - rect.top - rect.height / 2) * FOLLOW_STRENGTH);
    };

    const unsubscribe = subscribe(update);

    gsap.to(light, {
      opacity: 0.7,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      unsubscribe();
      gsap.killTweensOf(light);
    };
  }, [getPosition, subscribe]);

  return (
    <div
      ref={lightRef}
      aria-hidden="true"
      className="gold-light pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/45 blur-[140px] will-change-transform md:h-[700px] md:w-[700px] md:blur-[180px]"
    />
  );
}

export default GoldLight;
