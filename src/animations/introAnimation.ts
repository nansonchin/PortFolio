import gsap from "gsap";
import { glitchBurst, prefersReducedMotion, setGlitchText } from "./glitch";

const LINE_START = 0.45;
const LINE_STEP = 0.17;
const VERIFY_PAUSE = 0.55;

export type BootSequence = {
  timeline: gsap.core.Timeline;
  pace: { value: number }; 
};

export function createBootSequence(root: HTMLElement): BootSequence {
  const q = gsap.utils.selector(root);
  const pace = { value: 0 };
  const timeline = gsap.timeline();

  if (prefersReducedMotion()) {
    gsap.set(q(".boot-line, .boot-late, .boot-skip"), { autoAlpha: 1 });
    timeline.to(pace, { value: 1, duration: 0.8, ease: "none" });
    return { timeline, pace };
  }

  timeline.fromTo(
    q(".boot-flash"),
    { scaleY: 0.004, autoAlpha: 0.5 },
    { scaleY: 1, autoAlpha: 0, duration: 0.5, ease: "power3.out" },
    0,
  );

  let cursor = LINE_START;
  const lines = q(".boot-line") as HTMLElement[];

  lines.forEach((line, index) => {
    const text = line.querySelector<HTMLElement>(".boot-text");
    const late = Array.from(line.querySelectorAll<HTMLElement>(".boot-late"));

    const at = cursor + ((index * 7) % 5) * 0.012; 
    const typeTime = LINE_STEP * 0.9;
    const chars = Math.max(text?.textContent?.length ?? 1, 1);

    timeline.set(line, { autoAlpha: 1 }, at);

    if (text) {
      timeline.fromTo(
        text,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: typeTime,
          ease: `steps(${chars})`,
        },
        at,
      );
    }

    if (late.length > 0) {
      timeline.set(late, { autoAlpha: 1 }, at + typeTime);
    }

    if (line.dataset.kind === "verify") {
      const status = line.querySelector<HTMLElement>(".boot-status");

      timeline.call(
        () => {
          glitchBurst(status);
        },
        [],
        at + typeTime + 0.15,
      );

      timeline.call(
        () => {
          setGlitchText(status, "OK");
          status?.classList.remove("text-alert");
          status?.classList.add("text-gold-bright");
          glitchBurst(status, 420);
        },
        [],
        at + typeTime + VERIFY_PAUSE,
      );

      cursor += VERIFY_PAUSE; 
    }

    cursor += LINE_STEP;
  });

  timeline.fromTo(
    q(".boot-skip"),
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.3 },
    0.8,
  );

  const paceEnd = cursor + 0.2;
  timeline.to(
    pace,
    { value: 1, duration: paceEnd - 0.2, ease: "power2.inOut" },
    0.2,
  );

  return { timeline, pace };
}

type ExitArgs = {
  root: HTMLElement;
  onReveal: () => void;
  onDone: () => void;
};

export function createExitSequence({ root, onReveal, onDone }: ExitArgs) {
  const q = gsap.utils.selector(root);
  const timeline = gsap.timeline({ onComplete: onDone });

  if (prefersReducedMotion()) {
    timeline.add(onReveal, 0);
    timeline.to(root, { autoAlpha: 0, duration: 0.3 }, 0);
    return timeline;
  }

  timeline.add(() => {
    glitchBurst(q(".boot-percent")[0] as HTMLElement | undefined);
  }, 0);

  timeline.to(
    q(".boot-content"),
    { autoAlpha: 0, duration: 0.25, ease: "power2.in" },
    0.4,
  );

  timeline.fromTo(
    q(".boot-seam"),
    { scaleX: 0, autoAlpha: 1 },
    { scaleX: 1, duration: 0.35, ease: "power3.inOut" },
    0.5,
  );

  timeline.add(onReveal, 0.85);
  timeline.to(
    q(".boot-panel-top"),
    { yPercent: -101, duration: 0.9, ease: "power4.inOut" },
    0.85,
  );
  timeline.to(
    q(".boot-panel-bottom"),
    { yPercent: 101, duration: 0.9, ease: "power4.inOut" },
    0.85,
  );
  timeline.to(q(".boot-seam"), { autoAlpha: 0, duration: 0.25 }, 0.95);

  return timeline;
}
