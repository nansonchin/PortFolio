import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../animations/glitch";
import {registerTransitionRunner} from "./transitionRunner"
const COVER = 0.35;
const TYPE_AT = 0.25;
const TYPE_DURATION = 0.7;
const COMMIT_AT = 1.4;
const FADE_AT = 1.5;
const FADE = 0.5; // FADE_AT + FADE = 2.0s

function PageTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const okRef = useRef<HTMLSpanElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const flushPending = () => {
      const commit = pendingRef.current;
      pendingRef.current = null;
      commit?.();
    };

    const run = (commit: () => void, label: string) => {
      if (tlRef.current?.isActive()) {
        pendingRef.current = commit;
        return;
      }

      const curtain = curtainRef.current;
      const panel = panelRef.current;
      const text = textRef.current;
      const ok = okRef.current;

      if (prefersReducedMotion() || !curtain || !panel || !text || !ok) {
        commit();
        return;
      }

      pendingRef.current = commit;

      const prefix = `> navigate ${label} ........ `;
      const counter = { n: 0 };
      text.textContent = "";

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set([curtain, panel], { autoAlpha: 0 });
          curtain.style.pointerEvents = "none";
          tlRef.current = null;
        },
      });

      tl.set(curtain, { pointerEvents: "auto" }, 0)
        .set(ok, { autoAlpha: 0 }, 0)
        .to(curtain, { autoAlpha: 1, duration: COVER, ease: "power2.out" }, 0)
        .set(panel, { autoAlpha: 1 }, TYPE_AT)
        .to(
          counter,
          {
            n: prefix.length,
            duration: TYPE_DURATION,
            ease: `steps(${prefix.length})`,
            onUpdate: () => {
              text.textContent = prefix.slice(0, Math.round(counter.n));
            },
          },
          TYPE_AT,
        )
        .set(ok, { autoAlpha: 1 }, TYPE_AT + TYPE_DURATION + 0.1)
        .call(flushPending, [], COMMIT_AT)
        .to([curtain, panel], { autoAlpha: 0, duration: FADE, ease: "power2.in" }, FADE_AT);

      tlRef.current = tl;
    };

    const unregister = registerTransitionRunner(run);

    return () => {
      unregister();
      tlRef.current?.kill();
      tlRef.current = null;
      flushPending(); // 组件卸载时别吞掉还没执行的跳转
    };
  }, []);

  return (
    <>
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="fixed inset-0 z-[95000] bg-ink"
        style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
      />

      <div
        ref={panelRef}
        aria-hidden="true"
        className="fixed bottom-28 left-4 z-[95001] max-w-[90vw] border border-gold/40 bg-ink/90 px-5 py-3 backdrop-blur-sm"
        style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
      >
        <p className="font-system text-xs tracking-[0.12em] text-gold-bright">
          <span ref={textRef} />
          <span
            ref={okRef}
            className="text-gold glow-gold"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            OK
          </span>
          <span className="blink ml-0.5">▌</span>
        </p>
      </div>
    </>
  );
}

export default PageTransition;