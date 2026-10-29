import { Link } from "react-router-dom";
import { developerContext } from "../../data/developerContext";
import type { Project } from "../../entities/Project";
import { projectRepository } from "../../repository/ProjectRepository";
import SectionLabel from "../SectionLabel/SectionLabel";
import React, { useState } from "react";
import WorkPreview from "../FeaturedProjects/WorkPreview";
import { canHover } from "../FeaturedProjects/workUtils";
import TransitionLink from "../PageTransition/TransitionLink";

function groupByYear(projects: Project[]): [number, Project[]][] {
  const map = new Map<number, Project[]>();

  projects.forEach((project) => {
    map.set(project.year, [...(map.get(project.year) ?? []), project]);
  });

  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

function BuildLog() {
  const groups = groupByYear(projectRepository.getAll());
  const [activeProject, setActiveProject] = useState<{
    year: number;
    index: number;
  } | null>(null);
  
  const activate = (year:number,index: number) => {
    if (!canHover()) return;

    setActiveProject({year,index});
  };

  const clearActivate =()=>{
    setActiveProject(null)
  }

  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 md:mb-16">
          <SectionLabel index="02.2" text="BUILD LOG" className="mb-8" />
          <h2 className="heading-lg text-paper">What I&apos;ve built</h2>
        </div>

        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-24">
          <div
            onMouseLeave={()=>clearActivate()}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              ) {
                clearActivate()
              }
            }}
          >
            {groups.map(([year, items]) => (
              <React.Fragment key={year}>
                <WorkPreview
                  items={items}
                  activeIndex={
                    activeProject?.year === year ? activeProject.index : null
                  }
                  showSummary
                />
                <div
                  key={year}
                  data-reveal
                  className="grid gap-6 border-t border-line py-8 md:grid-cols-[8rem_1fr] md:gap-10"
                >
                  <p className="font-display text-5xl leading-none text-gold md:text-6xl">
                    {year}
                  </p>

                  <ul>
                    {items.map((project, index) => (
                      <li key={project.id}>
                        <TransitionLink
                          to={`/project/${project.slug}`}
                          data-cursor="view"
                          onMouseEnter={() => {
                            activate(year,index)
                          }}
                          onFocus={() => activate(year,index)}
                          className="bar-select flex items-baseline justify-between gap-6 px-3 py-3"
                        >
                          <span className="font-display text-2xl uppercase md:text-3xl">
                            {project.title}
                          </span>
                          <span className="label hidden opacity-60 sm:block">
                            {project.category}
                          </span>
                        </TransitionLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </React.Fragment>
            ))}
          </div>

          <aside className="space-y-12">
            <div data-reveal>
              <p className="label mb-5 text-gold">[ BG ] BACKGROUND</p>
              <ul className="space-y-3">
                {developerContext.background.map((item) => (
                  <li key={item} className="font-system text-sm text-paper">
                    <span className="mr-2 text-gold-dim">&gt;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <p className="label mb-5 text-gold">[ GL ] GOALS</p>
              <ul className="space-y-3">
                {developerContext.goals.map((item) => (
                  <li key={item} className="font-system text-sm text-paper">
                    <span className="mr-2 text-gold-dim">&gt;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default BuildLog;
