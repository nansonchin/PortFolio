import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import { prefersReducedMotion } from "../../animations/glitch";
import GoldLight from "../Hero/GoldLight";
import ProjectFrame from "./ProjectFrame";
import SectionLabel from "../SectionLabel/SectionLabel";
import { openJarvis } from "../TerminalAssistant/terminalEvent";

type ProjectHeroProps = {
  project: ProjectDetailModel;
  position: { index: number; total: number };
};

const pad = (value: number) => String(value).padStart(2, "0");

const buttonClass =
  "bar-select label inline-flex items-center gap-3 border border-gold/60 px-5 py-3";

function ProjectHero({ project, position }: ProjectHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(".detail-eyebrow", {
          y: 16,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.08,
        })
        .from(".detail-title-inner", { yPercent: 115, duration: 1.1 }, "-=0.4")
        .from(
          ".detail-step",
          { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.1 },
          "-=0.6",
        )
        .from(
          ".detail-frame",
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.2,
            ease: "power3.inOut",
          },
          "-=0.5",
        );
    },
    { scope: heroRef },
  );

  const specs = [
    { label: "YEAR", value: String(project.year) },
    { label: "CATEGORY", value: project.category.toUpperCase() },
    { label: "STACK", value: `${project.technologies.length} TECHNOLOGIES` },
    { label: "SCREENS", value: pad(project.gallery.length) },
  ];

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden bg-ink px-6 pb-20 pt-32 md:px-10 md:pb-28 md:pt-40"
    >
      <GoldLight />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="detail-eyebrow mb-10 flex items-center justify-between gap-6">
          <Link
            to="/projects"
            className="label text-gold-dim transition-colors hover:text-gold-bright"
          >
            ← ALL PROJECTS
          </Link>
          <p className="label text-gold-dim">
            {pad(position.index)} / {pad(position.total)}
          </p>
        </div>

        <div className="detail-eyebrow">
          <SectionLabel index="04" text="PROJECT" className="mb-8" />
        </div>

        <p className="detail-eyebrow label mb-6 text-gold">
          {project.category} / {project.year}
        </p>

        <h1 className="overflow-hidden pb-2">
          <span className="detail-title-inner block font-display text-[clamp(2.75rem,9vw,9rem)] uppercase leading-[0.92] text-paper">
            {project.title}
          </span>
        </h1>

        <p className="detail-step text-body mt-10 max-w-2xl">
          {project.description}
        </p>

        <div className="detail-step mt-10 flex flex-wrap items-center gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="code"
              data-magnetic
              className={buttonClass}
            >
              GitHub <span className="opacity-60">↗</span>
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="live"
              data-magnetic
              className={buttonClass}
            >
              Live demo <span className="opacity-60">↗</span>
            </a>
          )}

          <button
            type="button"
            data-magnetic
            onClick={() => openJarvis(
              // `Tell me about ${project.title}`
            )}
            className={buttonClass}
          >
            <span className="blink h-1.5 w-1.5 bg-current" />
            Ask JARVIS
          </button>
        </div>

        <dl className="detail-step mt-12 grid grid-cols-2 border-l border-t border-line md:grid-cols-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="border-b border-r border-line p-4 md:p-5"
            >
              <dt className="label text-gold-dim">{spec.label}</dt>
              <dd className="mt-2 font-system text-sm tracking-wide text-paper">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <ProjectFrame
          image={project.heroImage}
          alt={project.title}
          loading="eager"
          parallax
          className="detail-frame mt-12 md:mt-16"
        />
      </div>
    </section>
  );
}

export default ProjectHero;
