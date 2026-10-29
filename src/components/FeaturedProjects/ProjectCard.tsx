import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useImagePreload } from "../../hooks/useImagePreload";
import type { ProjectCardModel } from "../../models/ProjectCardModel";
import ProjectThumb from "./ProjectThumb";
import { useSharedImage } from "../PageTransition/SharedImageContext";
import TransitionLink from "../PageTransition/TransitionLink";

type ProjectCardProps = {
  project: ProjectCardModel;
  number: number;
};

const MAX_TECH = 4;

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectCard({ project, number }: ProjectCardProps) {
  const preloadImage = useImagePreload();

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const extraTech = project.technologies.length - MAX_TECH;

  const { capture } = useSharedImage();

  return (
    <article
      data-flip-card
      data-cursor="view"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => preloadImage(project.heroImage)}
      className="project-card group relative flex flex-col border border-line bg-ink p-4 transition-colors duration-300 hover:border-gold md:p-5"
    >
      {/* 跟着鼠标的金色聚光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),rgba(201,169,110,0.12),transparent_45%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative mb-4 flex items-center justify-between">
        <span className="label text-gold">[ {pad(number)} ]</span>
        <span className="label text-gold-dim">{project.year}</span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden border border-line bg-ink-2">
        <ProjectThumb
          src={project.thumbnail}
          alt={`${project.title} project preview`}
          className="transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <p className="label text-gold">{project.category}</p>

        <h3 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-paper md:text-4xl">
          <TransitionLink
            to={`/project/${project.slug}`}
            onClick={(event) => {
              const article = (event.currentTarget as HTMLElement).closest(
                "[data-flip-card]",
              ) as HTMLElement | null;
              const img = article?.querySelector("img");

              if (img && project.thumbnail) {
                capture({
                  src: project.thumbnail,
                  rect: img.getBoundingClientRect(),
                  slug: project.slug,
                });
              }
            }}
            className="after:absolute after:inset-0 after:content-[''] text-[clamp(1rem,2.2vw,2.75rem)]"
          >
            {project.title}
          </TransitionLink>
        </h3>

        <p className="text-body mt-4 line-clamp-2 text-[14px] ">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.technologies.slice(0, MAX_TECH).map((tech) => (
            <span
              key={tech}
              className="label border border-line px-2.5 py-1 text-paper/80"
            >
              {tech}
            </span>
          ))}
          {extraTech > 0 && (
            <span className="label px-1 py-1 text-gold-dim">+{extraTech}</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-6">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-cursor="code"
              className="label relative z-10 px-3 py-2 text-gold-dim transition-colors hover:text-gold-bright"
            >
              GitHub ↗
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-cursor="live"
              className="label relative z-10 px-3 py-2 text-gold-dim transition-colors hover:text-gold-bright"
            >
              Live demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
