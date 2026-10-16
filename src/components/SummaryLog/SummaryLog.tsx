import { useEffect, useState } from "react";

import { prefersReducedMotion } from "../../animations/glitch";

/* ── tuning knobs ───────────────────────────────────────── */
const MAX_CHARS = 140; // ≈ 3 lines in a 440px wide card
const LOADING_MS = 450; // how long "LOADING SUMMARY..." is shown
const DOT_MS = 140; // speed of the . .. ... animation
const CHAR_MS = 16; // typing speed (ms per character)

export function clampSummary(text: string, max = MAX_CHARS) {
  const clean = text.replace(/\s+/g, " ").trim();

  if (clean.length <= max) {
    return clean;
  }

  const cut = clean.slice(0, max);

  const lastSpace = cut.lastIndexOf(" ");

  const end = lastSpace > max * 0.6 ? lastSpace : max;

  return `${cut.slice(0, end).trimEnd()}...`;
}

type Phase = "loading" | "typing" | "done";

type SummaryLogProps = {
  summary: string;

  /** true while the floating preview is visible. Restarts the animation. */
  active: boolean;
};

function SummaryLog({ summary, active }: SummaryLogProps) {
  const full = clampSummary(summary);

  const [phase, setPhase] = useState<Phase>("loading");

  const [typed, setTyped] = useState(0);

  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (!active) {
      return;
    }

    // reduced motion: no loading, no typing, show the text immediately
    if (prefersReducedMotion()) {
      setTyped(full.length);

      setPhase("done");

      return;
    }

    setPhase("loading");

    setTyped(0);

    setDots(1);

    let typeTimer = 0;

    const dotTimer = window.setInterval(() => {
      setDots((value) => (value % 3) + 1);
    }, DOT_MS);

    const startTimer = window.setTimeout(() => {
      window.clearInterval(dotTimer);

      setPhase("typing");

      let count = 0;

      typeTimer = window.setInterval(() => {
        count += 1;

        setTyped(count);

        if (count >= full.length) {
          window.clearInterval(typeTimer);

          setPhase("done");
        }
      }, CHAR_MS);
    }, LOADING_MS);

    // hovering another row / leaving → cancel everything, no stale timers
    return () => {
      window.clearInterval(dotTimer);

      window.clearTimeout(startTimer);

      window.clearInterval(typeTimer);
    };
  }, [active, full]);

  return (
    <div className="mt-1.5 border border-gold/30 bg-ink px-3 py-2.5">
      <p className="label mb-2 text-gold-dim">[ SUMMARY ]</p>

      {/* fixed height = 3 lines, so the card never changes size while typing */}
      <p className="line-clamp-3 h-[3.7rem] overflow-hidden font-system text-xs leading-relaxed text-paper">
        {phase === "loading" ? (
          <span className="text-gold-dim">
            &gt; LOADING SUMMARY
            <span className="inline-block w-[3ch]">{".".repeat(dots)}</span>
          </span>
        ) : (
          <>
            {full.slice(0, typed)}

            {phase === "typing" && (
              <span className="blink ml-0.5 inline-block h-3 w-1.5 bg-gold align-[-2px]" />
            )}
          </>
        )}
      </p>
    </div>
  );
}

export default SummaryLog;