import { useLayoutEffect, useState } from "react";
import { toProjectCardModel } from "../../../../mapper/projectMapper";
import { projectRepository } from "../../../../repository/ProjectRepository";
import ProjectFilter from "../ProjectFilter/ProjectFilter";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import { useProjectFilter } from "../../../../hooks/useProjectFilter";
import ProjectSearch from "../ProjectSearch/ProjectSearch";
import { useProjectGridFlip } from "../../../../hooks/useProjectGridFlip";
import { flushSync } from "react-dom";

function ProjectExplorer() {
  const projects = projectRepository.getAll().map(toProjectCardModel);

  const categories: string[] = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredProjects,
  } = useProjectFilter({ projects });

  const { containerRef, captureFlip, playFlip } = useProjectGridFlip();

  return (
    <section className="px-6 md:px-10 lg:px-16 py-32 bg-black">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-16">
          <p className="text-yellow-400 uppercase tracking-[0.3rem]">Explore</p>
          <h2 className="mt-4 text-5xl md:text-7xl font-bold text-white">
            All Projects
          </h2>
        </div>
        <ProjectSearch value={searchQuery} onChange={setSearchQuery} />
        <ProjectFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={(category) => {
            const state = captureFlip();

            flushSync(() => {
              setActiveCategory(category);
            });

            playFlip(state);
          }}
        />
        <div className="mt-16">
          <ProjectGrid
            projects={filteredProjects}
            containerRef={containerRef}
          />
        </div>
      </div>
    </section>
  );
}

export default ProjectExplorer;
