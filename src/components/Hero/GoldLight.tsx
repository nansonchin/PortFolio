import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCursorPhysics } from "../Cursor/CursorPhysicsContext";
import { prefersReducedMotion } from "../../animations/glitch";

const FOLLOW_STRENGTH = 0.8;

const GOLD = "201 169 110";
const GLOW = `radial-gradient(closest-side,
  rgb(${GOLD} / 0.36) 0%,
  rgb(${GOLD} / 0.30) 20%,
  rgb(${GOLD} / 0.18) 47%,
  rgb(${GOLD} / 0.06) 75%,
  rgb(${GOLD} / 0) 100%)`;

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

    const pulse = gsap.to(light, {
      opacity: 0.7,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        pulse.play();
      } else {
        pulse.pause();
      }
    });
    observer.observe(section);

    return () => {
      observer.disconnect();
      unsubscribe();
      gsap.killTweensOf(light);
    };
  }, [getPosition, subscribe]);

  return (
    <div
      ref={lightRef}
      aria-hidden="true"
      className="gold-light pointer-events-none absolute left-1/2 top-1/2 h-[1060px] w-[1060px] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform md:h-[1400px] md:w-[1400px]"
      style={{ background: GLOW }}
    />
  );
}

export default GoldLight;
