import { useRef } from "react";
import ProjectHeroFeatures from "../features/projects/components/ProjectHero/ProjectHero";
import ProjectStats from "../features/projects/components/ProjectStats/ProjectStats";
import ProjectExplorer from "../features/projects/components/ProjectExplorer/ProjectExplorer";
import { projectRepository } from "../repository/ProjectRepository";
import { useReveal } from "../hooks/useReveal";
import { useGlitchLoop } from "../hooks/useGlitchLoop"; 

function Projects() {
  const pageRef = useRef<HTMLElement | null>(null);
  const stats = projectRepository.getStats();

  useReveal(pageRef);
   useGlitchLoop(pageRef);      

  return (
    <main ref={pageRef} className="min-h-screen bg-ink">
      <ProjectHeroFeatures />
      <ProjectStats stats={stats} />
      <ProjectExplorer />
    </main>
  );
}

export default Projects;