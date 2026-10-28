
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { JARVIS_NAVIGATE_EVENT, type JarvisNavigateDetail } from "../../components/TerminalAssistant/terminalEvent";
import { prefersReducedMotion } from "../../animations/glitch";
function JarvisNavFlash() {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const show = useCallback((path: string) => {
    tlRef.current?.kill();

    const fullText = `> navigate ${path}`;
    const dots = " ........ ";
    const status = "OK";
    const final = fullText + dots + status;

    setVisible(true);
    setText("");

    if (prefersReducedMotion()) {
      setText(final);
      const tl = gsap.timeline();
      tl.set(panelRef.current, { autoAlpha: 1 });
      tl.to(panelRef.current, { autoAlpha: 0, duration: 0.3, delay: 0.6 });
      tl.call(() => setVisible(false));
      tlRef.current = tl;
      return;
    }

    const panel = panelRef.current;
    if (!panel) return;

    const tl = gsap
      .timeline({ onComplete: () => setVisible(false) })
      .set(panel, { autoAlpha: 1 })
      .to(
        {},
        {
          duration: 0.35,
          ease: `steps(${final.length})`,
          onUpdate() {
            const progress = this.progress();
            setText(final.slice(0, Math.round(progress * final.length)));
          },
        },
      )
      .to({}, { duration: 0.35 })
      .to(panel, { autoAlpha: 0, duration: 0.25, ease: "power2.in" });

    tlRef.current = tl;
  }, []);

  useEffect(() => {
    const handler = (event: Event) => {
      const { path } = (event as CustomEvent<JarvisNavigateDetail>).detail;
      show(path);
    };

    window.addEventListener(JARVIS_NAVIGATE_EVENT, handler);
    return () => window.removeEventListener(JARVIS_NAVIGATE_EVENT, handler);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      ref={panelRef}
      aria-live="polite"
      aria-label="JARVIS navigation status"
      className="
        fixed bottom-28 left-4
        z-[95001]
        max-w-[90vw]
        border border-gold/40 bg-ink/90
        px-5 py-3
        backdrop-blur-sm
      "
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <p className="font-system text-xs tracking-[0.12em] text-gold-bright">
        {text.length > 0 && text.endsWith("OK") ? (
          <>
            {text.slice(0, -2)}
            <span className="text-gold glow-gold">OK</span>
          </>
        ) : (
          text
        )}
        <span className="blink ml-0.5">▌</span>
      </p>
    </div>
  );
}

export default JarvisNavFlash;