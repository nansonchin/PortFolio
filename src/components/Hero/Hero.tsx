import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import GoldLight from "./GoldLight";
import TechMarquee from "./TechMarquee";
import { heroReveal } from "../../animations/heroReveal";
import { startHeroGlitch } from "../../animations/heroGlitch";
import { developerContext } from "../../data/developerContext";
import { useIntro } from "../../hooks/useIntro";
import GlitchText from "../GlitchText/GlitchText";
import { openJarvis } from "../TerminalAssistant/terminalEvent";

const TAGLINE = "Building digital experiences with React, TypeScript and AI";

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { phase } = useIntro();
  const canReveal = phase !== "booting";

  // const name = developerContext.name.toUpperCase();
  const name = "Frontend"
  const nameVw = 80 / (name.length * 0.62);

  useGSAP(
    () => {
      if (!canReveal) return;


      const timeline = heroReveal();
      const nameElement =
        heroRef.current?.querySelector<HTMLElement>(".hero-name") ?? null;

      let stopGlitch = () => {};

      timeline.eventCallback("onComplete", () => {
        stopGlitch = startHeroGlitch(nameElement);
      });

      return () => stopGlitch();
    },
    { scope: heroRef, dependencies: [canReveal] },
  );

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-ink"
    >
      <GoldLight />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-16 pt-32 md:px-10">
        <p className="hero-eyebrow label mb-8 text-gold">[ 00 ] PORTFOLIO / 2026</p>

        <h1>
          <span className="block overflow-hidden pb-[0.04em]">
            <span
              className="hero-line-inner heading-name block text-paper"
              style={{ fontSize: `min(${nameVw.toFixed(1)}vw, 20rem)` }}
            >
              <GlitchText text={name} className="hero-name" />
            </span>
          </span>

          <span className="mt-4 block overflow-hidden pb-[0.15em]">
            <span className="hero-line-inner block font-display text-[clamp(1.75rem,4.5vw,4rem)] italic leading-none text-gold-bright">
              "Developer"
            </span>
          </span>
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-description text-body max-w-xl">{TAGLINE}</p>

          <div className="hero-actions flex flex-wrap items-center gap-6">
            <button
              type="button"
              data-magnetic
              onClick={()=>openJarvis()}
              aria-label="Open JARVIS assistant"
              className="bar-select label flex items-center gap-3 border border-gold/60 px-5 py-3"
            >
              <span className="blink h-1.5 w-1.5 bg-current" />
              Ask JARVIS
              <span className="opacity-60">→</span>
            </button>

            <div className="label flex items-center gap-3 text-gold-dim">
              <span>Scroll to explore</span>
              <span className="scroll-line block h-px w-12 origin-left bg-gold" />
            </div>
          </div>
        </div>
      </div>

      <TechMarquee />
    </section>
  );
}

export default Hero;