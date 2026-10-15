import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import HeroTitle from "./HeroTitle";
import GoldLight from "./GoldLight";
import { heroReveal } from "../../animations/heroReveal";

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      heroReveal();
    },
    { scope: heroRef },
  );

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-ink px-6 md:px-10"
    >
      <GoldLight />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="hero-eyebrow label mb-8 text-gold">[ 00 ] PORTFOLIO / 2026</p>

        <HeroTitle text="FRONT ENGINEER" />

        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-description text-body max-w-xl">
            Building digital experiences with React, TypeScript and AI
          </p>

          <div className="hero-scroll-indicator label flex items-center gap-3 text-gold-dim">
            <span>Scroll to explore</span>
            <span className="scroll-line block h-px w-12 origin-left bg-gold" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;