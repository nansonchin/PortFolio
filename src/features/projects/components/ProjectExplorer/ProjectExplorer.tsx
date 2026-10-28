import { useEffect, useMemo } from "react";
import { flushSync } from "react-dom";
import { toProjectCardModel } from "../../../../mapper/projectMapper";
import { projectRepository } from "../../../../repository/ProjectRepository";
import { useProjectFilter } from "../../../../hooks/useProjectFilter";
import { useProjectGridFlip } from "../../../../hooks/useProjectGridFlip";
import ProjectFilter from "../ProjectFilter/ProjectFilter";
import ProjectGrid from "../ProjectGrid/ProjectGrid";
import ProjectSearch from "../ProjectSearch/ProjectSearch";
import SectionLabel from "../../../../components/SectionLabel/SectionLabel";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../../../animations/glitch";
import { useSearchParams } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectExplorer() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".project-card", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: ".project-card",
          start: "top 90%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  const projects = useMemo(
    () => projectRepository.getAll().map(toProjectCardModel),
    [],
  );

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category))],
    [projects],
  );

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: projects.length };

    projects.forEach((project) => {
      result[project.category] = (result[project.category] ?? 0) + 1;
    });

    return result;
  }, [projects]);

  const numbers = useMemo(
    () =>
      Object.fromEntries(
        projects.map((project, index) => [project.id, index + 1]),
      ),
    [projects],
  );

  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredProjects,
  } = useProjectFilter({ projects });

  const { containerRef, captureFlip, playFlip } = useProjectGridFlip();

  const applyChange = (update: () => void) => {
    const state = captureFlip();

    flushSync(update);

    playFlip(state);
  };

  const resetFilters = () => {
    applyChange(() => {
      setActiveCategory("All");
      setSearchQuery("");
    });
  };

  const isFiltered = activeCategory !== "All" || searchQuery.trim() !== "";

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
    if (searchParam) {
      setSearchQuery(searchParam.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section ref={sectionRef} className="px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-10 md:mb-14">
          <SectionLabel index="05.1" text="ARCHIVE" className="mb-8" />
          <h2 className="heading-lg text-paper">All projects</h2>
        </div>

        <div data-reveal className="space-y-6">
          <ProjectSearch
            value={searchQuery}
            onChange={(value) => applyChange(() => setSearchQuery(value))}
          />

          <ProjectFilter
            categories={categories}
            counts={counts}
            activeCategory={activeCategory}
            onChange={(category) =>
              applyChange(() => setActiveCategory(category))
            }
          />

          <p aria-live="polite" className="label text-gold-dim">
            SHOWING{" "}
            <span className="text-gold-bright">
              {pad(filteredProjects.length)}
            </span>{" "}
            / {pad(projects.length)}
            {activeCategory !== "All" && ` // ${activeCategory.toUpperCase()}`}
            {searchQuery.trim() && ` // "${searchQuery.trim().toUpperCase()}"`}
            {isFiltered && filteredProjects.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-4 text-gold transition-colors hover:text-gold-bright"
              >
                [ RESET ]
              </button>
            )}
          </p>
        </div>

        <div className="mt-12">
          <ProjectGrid
            projects={filteredProjects}
            numbers={numbers}
            containerRef={containerRef}
            onReset={resetFilters}
          />
        </div>
      </div>
    </section>
  );
}

export default ProjectExplorer;
