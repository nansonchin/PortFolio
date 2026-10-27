import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AboutIntro from "../components/About/AboutIntro";
import BuildLog from "../components/About/BuildLog";
import SkillMatrix from "../components/About/SkillMatrix";
import { developerContext } from "../data/developerContext";
import { profile } from "../data/profile";
import { useReveal } from "../hooks/useReveal";
import { projectRepository } from "../repository/ProjectRepository";
import { useGlitchLoop } from "../hooks/useGlitchLoop";
import { useSEO } from "../hooks/useSEO";

function About() {
  useSEO({
    title: "About",
    description: "Learn about Chin's background, skills and what he's built.",
  });
  const pageRef = useRef<HTMLElement | null>(null);

  useReveal(pageRef);

  useGlitchLoop(pageRef);
  return (
    <main ref={pageRef} className="bg-ink">
      <AboutIntro />
      <SkillMatrix />
      <BuildLog />

      <section className="border-t border-line px-6 py-24 md:px-10 md:py-32">
        <div
          data-reveal
          className="mx-auto flex max-w-7xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between"
        >
          <Link
            to="/contact"
            data-magnetic
            className="bar-select label inline-flex items-center gap-3 border border-gold/60 px-5 py-3"
          >
            Get in touch
            <span className="opacity-60">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}

export default About;
