import { useParams } from "react-router-dom";
import {
  ProjectHero,
  ProjectOverview,
  ProjectTechStack,
} from "../components/ProjectDetails";
import { projectRepository } from "../repository/ProjectRepository";
import { toProjectDetailModel } from "../mapper/projectMapper";
import ProjectGallery from "../components/ProjectDetails/ProjectGallery";

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
  return (
    <main>
        <ProjectHero project={detailProject} />
        <ProjectOverview project={detailProject} />
        <ProjectTechStack project={detailProject} />
        <ProjectGallery project={detailProject}/>
    </main>
  );
}

export default ProjectDetail;
