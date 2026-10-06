import type { ProjectDetailModel } from "../../models/ProjectDetailModel";

type ProjectTechStackProps = {
  project: ProjectDetailModel;
};

function ProjectTechStack({ project }: ProjectTechStackProps) {
  return (
    <section className="px-8 md:px-16 py-24">
      <h2 className="text-4xl font-semibold text-white">Technologies</h2>
      <div className="mt-10 flex gap-3 flex-wrap">
        {project.technologies.map((tech) => (
          <span className="px-4 py-2 rounded-full bg-white/10 text-white">
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}

export default ProjectTechStack;
