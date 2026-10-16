import type { RefObject } from "react";
import ProjectCard from "../../../../components/FeaturedProjects/ProjectCard";
import type { ProjectCardModel } from "../../../../models/ProjectCardModel";

type ProjectGridProps = {
  projects: ProjectCardModel[];
  numbers: Record<string, number>;
  containerRef: RefObject<HTMLDivElement | null>;
  onReset: () => void;
};

function ProjectGrid({ projects, numbers, containerRef, onReset }: ProjectGridProps) {
  return (
    <div ref={containerRef} className="relative grid gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} number={numbers[project.id] ?? 0} />
      ))}

      {projects.length === 0 && (
        <div className="col-span-full flex flex-col items-start gap-6 border border-line p-8 md:p-12">
          <p className="label text-alert">[ NO MATCH ]</p>
          <p className="text-body max-w-md">
            No project matches the current filter. Try another keyword, or reset the filters.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="bar-select label border border-gold/60 px-5 py-3"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}

export default ProjectGrid;