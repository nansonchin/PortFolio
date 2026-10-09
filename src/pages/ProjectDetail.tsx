import { useParams } from "react-router-dom";
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

function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? projectRepository.getBySlug(slug) : undefined;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Project Not Found
      </div>
    );
  }
  const detailProject = toProjectDetailModel(project);
  console.log(project.architecture)
  return (
    <main>
      <ProjectHero project={detailProject} />
      <ProjectOverview project={detailProject} />
      <ProjectStory story={detailProject.story} />
      {detailProject.architecture && (
        <ArchitectureSection architecture={detailProject.architecture} />
      )}
      <ProjectTechStack project={detailProject} />
      <ProjectGallery project={detailProject} />
    </main>
  );
}

export default ProjectDetail;
