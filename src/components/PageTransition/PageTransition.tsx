import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../animations/glitch";
import { registerTransitionRunner, type TransitionVariant } from "./transitionRunner";

type Preset = {
  cover: number;
  typeAt: number;
  typeDur: number;
  okAt: number;
  commitAt: number;
  fadeAt: number;
  fade: number;
};

const PRESETS: Record<TransitionVariant, Preset> = {
  // 2.0s
  full: { cover: 0.35, typeAt: 0.25, typeDur: 0.7, okAt: 1.05, commitAt: 1.4, fadeAt: 1.5, fade: 0.5 },
  // 1.3s
  standard: { cover: 0.25, typeAt: 0.15, typeDur: 0.4, okAt: 0.6, commitAt: 0.8, fadeAt: 0.9, fade: 0.4 },
  // 0.8s
  quick: { cover: 0.2, typeAt: 0.1, typeDur: 0.2, okAt: 0.33, commitAt: 0.45, fadeAt: 0.5, fade: 0.3 },
};

function buildLabel(variant: TransitionVariant, path: string) {
  return variant === "quick" ? `> ${path} ` : `> navigate ${path} ........ `;
}

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

    const run = (commit: () => void, label: string, variant: TransitionVariant) => {
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

      const p = PRESETS[variant];
      const prefix = buildLabel(variant, label);
      const counter = { n: 0 };

      pendingRef.current = commit;
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
        .to(curtain, { autoAlpha: 1, duration: p.cover, ease: "power2.out" }, 0)
        .set(panel, { autoAlpha: 1 }, p.typeAt)
        .to(
          counter,
          {
            n: prefix.length,
            duration: p.typeDur,
            ease: `steps(${prefix.length})`,
            onUpdate: () => {
              text.textContent = prefix.slice(0, Math.round(counter.n));
            },
          },
          p.typeAt,
        )
        .set(ok, { autoAlpha: 1 }, p.okAt)
        .call(flushPending, [], p.commitAt)
        .to([curtain, panel], { autoAlpha: 0, duration: p.fade, ease: "power2.in" }, p.fadeAt);

      tlRef.current = tl;
    };

    const unregister = registerTransitionRunner(run);

    return () => {
      unregister();
      tlRef.current?.kill();
      tlRef.current = null;
      flushPending(); 
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