import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import SectionLabel from "../SectionLabel/SectionLabel";

type ProjectTechStackProps = {
  index: string;
  project: ProjectDetailModel;
};

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectTechStack({ index, project }: ProjectTechStackProps) {
  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 md:mb-16">
          <SectionLabel index={index} text="TECHNOLOGY" className="mb-8" />
          <h2 className="heading-lg text-paper">Built with</h2>
        </div>

        <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {project.technologies.map((tech, i) => (
            <div
              key={tech}
              data-reveal
              className="bar-select flex min-h-40 flex-col justify-between border-b border-r border-line p-6 md:p-8"
            >
              <span className="label opacity-60">[ {pad(i + 1)} ]</span>
              <span className="font-display text-3xl uppercase md:text-4xl">{tech}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectTechStack;