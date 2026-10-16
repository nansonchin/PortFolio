import { useEffect, type RefObject } from "react";

import { glitchBurst, prefersReducedMotion } from "../animations/glitch";

const MIN_GAP = 3; // seconds, same rhythm as the Home "Frontend"
const MAX_GAP = 7;
const STAGGER = 1.4; // each glitch text on a page starts 1.4s after the previous one
const MIN_SPACING = 800; // ms – never let two texts burst almost at the same time

/** Shared by every loop on the page, so bursts take turns. */
let lastBurstAt = 0;

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return rect.bottom > 0 && rect.top < window.innerHeight;
}

export function useGlitchLoop(
  scopeRef: RefObject<HTMLElement | null>,
  firstDelay = 2.4,
) {
  useEffect(() => {
    const scope = scopeRef.current;

    if (!scope || prefersReducedMotion()) {
      return;
    }

    const targets = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-glitch-loop]"),
    );

    let stopped = false;

    const timers = new Map<HTMLElement, number>();

    const schedule = (target: HTMLElement, seconds: number) => {
      const id = window.setTimeout(() => {
        if (stopped) {
          return;
        }

        const now = performance.now();

        if (
          !document.hidden &&
          isInViewport(target) &&
          now - lastBurstAt > MIN_SPACING
        ) {
          lastBurstAt = now;

          glitchBurst(target);

          if (Math.random() < 0.3) {
            window.setTimeout(() => {
              if (!stopped) {
                glitchBurst(target, 240);
              }
            }, 380);
          }
        }

        schedule(target, MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
      }, seconds * 1000);

      timers.set(target, id);
    };

    targets.forEach((target, index) => {
      schedule(target, firstDelay + index * STAGGER);
    });

    return () => {
      stopped = true;

      timers.forEach((id) => window.clearTimeout(id));

      targets.forEach((target) => {
        delete target.dataset.glitch;
      });
    };
  }, [scopeRef, firstDelay]);
}