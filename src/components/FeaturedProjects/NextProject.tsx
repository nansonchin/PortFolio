import { Link } from "react-router-dom";
import type { Project } from "../../entities/Project";

type NextProjectProps = {
  project: Project;
};

function NextProject({ project }: NextProjectProps) {
  return (
    <section className="border-t border-line bg-ink px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between gap-6">
          <Link
            to="/projects"
            className="label text-gold-dim transition-colors hover:text-gold-bright"
          >
            ← ALL PROJECTS
          </Link>
          <p className="label text-gold">[ NEXT ]</p>
        </div>

        <Link
          to={`/project/${project.slug}`}
          data-cursor="view"
          className="bar-select group block px-4 py-10 md:px-8 md:py-16"
        >
          <p className="label mb-4 opacity-60">
            NEXT PROJECT / {project.category} / {project.year}
          </p>

          <span className="flex items-end justify-between gap-6">
            <span className="heading-lg uppercase">{project.title}</span>
            <span className="font-system text-4xl transition-transform duration-500 group-hover:translate-x-3 md:text-6xl">
              →
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}

export default NextProject;
