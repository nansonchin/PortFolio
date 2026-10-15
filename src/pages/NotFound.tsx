import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { startHeroGlitch } from "../animations/heroGlitch";
import GlitchText from "../components/GlitchText/GlitchText";

function NotFound() {
  const numberRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const target = numberRef.current?.querySelector<HTMLElement>(".glitch") ?? null;
    return startHeroGlitch(target, 0.8);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-ink px-6 text-center">
      <p className="label text-alert">[ ERROR ] SIGNAL LOST</p>

      <h1
        ref={numberRef}
        className="font-display text-[clamp(6rem,22vw,17rem)] leading-none text-paper"
      >
        <GlitchText text="404" />
      </h1>

      <p className="text-body max-w-md">
        This page doesn&apos;t exist in PORTFOLIO_OS. Use the links below, or ask JARVIS to take you
        somewhere.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="bar-select label border border-gold/60 px-5 py-3">
          Home
        </Link>
        <Link to="/projects" className="bar-select label border border-gold/60 px-5 py-3">
          Projects
        </Link>
      </div>
    </main>
  );
}

export default NotFound;