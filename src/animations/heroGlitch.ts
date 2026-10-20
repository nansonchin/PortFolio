import { glitchBurst, prefersReducedMotion } from "./glitch";

const MIN_GAP = 3; // 秒
const MAX_GAP = 7;

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

/** 每隔 3~7 秒让元素故障一下。回传「停止」函数。 */
export function startHeroGlitch(
  target: HTMLElement | null,
  firstDelay = 2.2,
): () => void {
  if (!target || prefersReducedMotion()) return () => {};

  let stopped = false;
  let timer: number | undefined;

  const schedule = (seconds: number) => {
    timer = window.setTimeout(() => {
      if (stopped) return;

      // 分页不在前景、或名字已经滚出屏幕，就不浪费
      if (!document.hidden && isInViewport(target)) {
        const double = Math.random() < 0.3;

        glitchBurst(target);

        if (double) {
          window.setTimeout(() => {
            if (!stopped) glitchBurst(target, 240);
          }, 380);
        }
      }

      schedule(MIN_GAP + Math.random() * (MAX_GAP - MIN_GAP));
    }, seconds * 1000);
  };

  schedule(firstDelay);

  return () => {
    stopped = true;
    window.clearTimeout(timer);
  };
}