import { useMemo, useState } from "react";
import type { ProjectCardModel } from "../models/ProjectCardModel";

type UseProjectFilterProps = {
  projects: ProjectCardModel[];
};

export function useProjectFilter({ projects }: UseProjectFilterProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchCategory = activeCategory === "All" || project.category === activeCategory;

      const matchSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(query));

      return matchCategory && matchSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredProjects,
  };
}