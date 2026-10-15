import { Link, useParams } from "react-router-dom";
import {
  ProjectHero,
  ProjectOverview,
  ProjectTechStack,
} from "../components/ProjectDetails";
import { projectRepository } from "../repository/ProjectRepository";
import { toProjectDetailModel } from "../mapper/projectMapper";
import ProjectGallery from "../components/ProjectDetails/ProjectGallery";
import ProjectStory from "../components/ProjectStory/ProjectStory";
import ArchitectureSection from "../components/Architecture/ArchitectureSection";
import NextProject from "../components/FeaturedProjects/NextProject";

function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? projectRepository.getBySlug(slug) : undefined;

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
        <p className="label text-alert">[ 404 ] PROJECT NOT FOUND</p>
        <Link to="/projects" className="bar-select label border border-gold/60 px-5 py-3">
          ← Back to projects
        </Link>
      </main>
    );
  }

  const detailProject = toProjectDetailModel(project);
  const nextProject = projectRepository.getNext(project.slug);

  return (
    <main key={project.slug}>
      <ProjectHero project={detailProject} />
      <ProjectOverview project={detailProject} />
      <ProjectStory story={detailProject.story} />
      {detailProject.architecture && (
        <ArchitectureSection architecture={detailProject.architecture} />
      )}
      <ProjectTechStack project={detailProject} />
      <ProjectGallery project={detailProject} />
      {nextProject && <NextProject project={nextProject} />}
    </main>
  );
}

export default ProjectDetail;