import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import SectionLabel from "../SectionLabel/SectionLabel";

type ProjectOverviewProps = {
  index: string;
  project: ProjectDetailModel;
};

const pad = (value: number) => String(value).padStart(2, "0");

type ListBlockProps = {
  tag: string;
  title: string;
  items: string[];
};

function ListBlock({ tag, title, items }: ListBlockProps) {
  if (items.length === 0) return null;

  return (
    <div data-reveal>
      <p className="label mb-5 text-gold">
        [ {tag} ] {title}
      </p>

      <ul className="border-t border-line">
        {items.map((item, i) => (
          <li
            key={`${i}-${item}`}
            className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-4"
          >
            <span className="label text-gold-dim">{pad(i + 1)}</span>
            <span className="font-system text-sm tracking-wide text-paper">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectOverview({ index, project }: ProjectOverviewProps) {
  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 md:mb-16">
          <SectionLabel index={index} text="OVERVIEW" className="mb-8" />
          <h2 className="heading-lg text-paper">What it does</h2>
        </div>

        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <ListBlock tag="FT" title="FEATURES" items={project.features} />
          <ListBlock tag="RS" title="MY RESPONSIBILITIES" items={project.responsibilities} />
        </div>
      </div>
    </section>
  );
}

export default ProjectOverview;