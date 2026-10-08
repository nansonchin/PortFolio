import Image from "../Image";
import { useInteractiveCard } from "../../hooks/useInteractiveCard";
import type { ProjectCardModel } from "../../models/ProjectCardModel";
import { useNavigate } from "react-router-dom";
import { useCursorContext } from "../../hooks/useCursorContext";
import { useImagePreload } from "../../hooks/useImagePreload";

type ProjectCardProps = {
  project: ProjectCardModel;
};

function ProjectCard({ project }: ProjectCardProps) {
  const { cardRef, handleMouseMove, handleMouseLeave } = useInteractiveCard();

  const navigate = useNavigate();
  const { mode } = useCursorContext();

  const preloadImage = useImagePreload()

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const interactiveElement = target.closest(
      "a,button,[role='button'], input, textarea,select",
    );

    if (interactiveElement) {
      return;
    }

    navigate(`/project/${project.slug}`);
  };
  // console.log(mode);
  return (
    <article
    data-flip-card
      data-cursor="view"
      onClick={handleCardClick}
      ref={cardRef}
      // onMouseLeave={handleMouseLeave}
      // onMouseMove={handleMouseMove}
      onMouseEnter={()=>{
        preloadImage(project.heroImage)
      }}
      className="project-card relative transform-gpu preserve-3d group  border border-white/10 rounded-2xl overflow-hidden
                bg-black transition-all duration-500 hover:-translate-y-2"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,220,34,0.15),transparent_40%)]" />
      <div className="aspect-video overflow-hidden bg-neutral-900">
        <Image
          src={project.thumbnail}
          alt={`${project.title} project preview`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <p className="text-xs uppercase tacking-[0.3em] text-yellow-400 mb-3">
          {project.category}
        </p>
        <h3 className="text-2x1 font-semibold text-white">{project.title}</h3>
        <p className="mt-4 text-neutral-400 loading-relaxed">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-2 mt-6">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs rounded-full bg-white/10 text-neutral-3000"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-4 mt-8 justify-between">
          <div className="">
            <a
              data-magnetic
              data-cursor="code"
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white underline py-[10px] px-[25px]"
            >
              Github
            </a>
          </div>

          {project.demoUrl && (
            <div>
              <a
                data-magnetic
                data-cursor="live"
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-yellow-400 underline py-[10px] px-[25px]"
              >
                Live Demo
              </a>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
