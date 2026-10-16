import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projectRepository } from "../../repository/ProjectRepository";
import { prefersReducedMotion } from "../../animations/glitch";
import WorkPreview from "./WorkPreview";
import ProjectThumb from "./ProjectThumb";
import { canHover, workLog } from "./workUtils";
import SectionLabel from "../SectionLabel/SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const pad = (value: number) => String(value).padStart(2, "0");

function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const projects = projectRepository.getFeatures();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      workLog("rows", { count: projects.length });

      if (prefersReducedMotion()) return;

      gsap.from(".work-header > *", {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-header",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".work-row", {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".work-list", start: "top 80%", once: true },
      });
    },
    { scope: sectionRef },
  );

  const activate = (index: number) => {
    if (!canHover()) return;

    workLog("hover", { index, slug: projects[index].slug });
    setActiveIndex(index);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="work-header mb-12 md:mb-16">
          <SectionLabel index="01" text="SELECTED WORK" className="mb-8" />

          <div className="flex items-end justify-between gap-6">
            <h2 className="heading-lg text-paper">Featured projects</h2>
            <p className="label text-gold-dim">{pad(projects.length)} ITEMS</p>
          </div>
        </div>

        <ul
          className="work-list work-list-root border-t border-line"
          onMouseLeave={() => setActiveIndex(null)}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setActiveIndex(null);
            }
          }}
        >
          {projects.map((project, index) => (
            <li key={project.id} className="work-row border-b border-line">
              <Link
                to={`/project/${project.slug}`}
                data-cursor="view"
                onMouseEnter={() => activate(index)}
                onFocus={() => activate(index)}
                className="work-link bar-select grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 px-3 py-6 md:grid-cols-[4rem_1fr_13rem_4rem_2rem] md:gap-x-8 md:px-6 md:py-9"
              >
                <span className="label opacity-60">{pad(index + 1)}</span>

                <span className="font-display text-[clamp(1rem,3.2vw,2.75rem)] uppercase leading-[0.95]">
                  {project.title}
                </span>

                <span className="label hidden opacity-60 md:block">
                  {project.category}
                </span>
                <span className="label hidden opacity-60 md:block">
                  {project.year}
                </span>

                <span className="work-arrow label justify-self-end">→</span>

                <span className="label col-start-2 col-end-[-1] mt-2 opacity-60 md:hidden">
                  {project.category} / {project.year}
                </span>

                <span className="col-start-2 col-end-[-1] mt-4 hidden aspect-[16/9] overflow-hidden [@media(hover:none)]:block">
                  <ProjectThumb
                    src={project.thumbnail}
                    alt={`${project.title} preview`}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/projects"
          data-magnetic
          className="bar-select label mt-12 inline-flex items-center gap-3 border border-gold/60 px-5 py-3"
        >
          View all projects
          <span className="opacity-60">→</span>
        </Link>
      </div>

      <WorkPreview items={projects} activeIndex={activeIndex} />
    </section>
  );
}

export default FeaturedProjects;
