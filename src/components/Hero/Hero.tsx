import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import HeroTitle from "./HeroTitle";
import GoldLight from "./GoldLight";
import { useRef } from "react";
import { heroReveal } from "../../animations/heroReveal";

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      heroReveal();
    },
    {
      scope: heroRef,
    },
  );

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center px-8 relative overflow-hidden bg-black"
    >
      <GoldLight />
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <p className="hero-eyebrow mb-6 text-xs md:text-sm uppdercase tacking-[0.35em] text-[var(--gold)]">
          Portfolio / 2026
        </p>
        <HeroTitle text="FRONT ENGINEER" />
        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <p className="hero-description text-body max-w-xl">
            Building digital experiences with React, TypeScript and AI
          </p>
          <div className="hero-scroll-indicator flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
            <span>Scroll to Explore</span>
            <span className="scroll-line block h-px w-12 bg-[var(--gold)] origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
