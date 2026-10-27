import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import type { Project } from "../entities/Project";
import { projectRepository } from "../repository/ProjectRepository";
import { toProjectDetailModel } from "../mapper/projectMapper";
import { useReveal } from "../hooks/useReveal";
import { useFrameParallax } from "../hooks/useFrameParallax";
import { isUsableImage } from "../components/FeaturedProjects/workUtils";
import ProjectHero from "../components/ProjectDetails/ProjectHero";
import ProjectOverview from "../components/ProjectDetails/ProjectOverview";
import ProjectStory from "../components/ProjectStory/ProjectStory";
import ArchitectureSection from "../components/Architecture/ArchitectureSection";
import ProjectTechStack from "../components/ProjectDetails/ProjectTechStack";
import ProjectGallery from "../components/ProjectDetails/ProjectGallery";
import NextProject from "../components/FeaturedProjects/NextProject";
import { useGlitchLoop } from "../hooks/useGlitchLoop";
import { useSEO } from "../hooks/useSEO";

type ProjectDetailViewProps = {
  project: Project;
};

function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const pageRef = useRef<HTMLElement | null>(null);

  useReveal(pageRef);
  useFrameParallax(pageRef);
  useGlitchLoop(pageRef);

  const detail = toProjectDetailModel(project);
  const nextProject = projectRepository.getNext(project.slug);

  const all = projectRepository.getAll();
  const position = {
    index: all.findIndex((item) => item.id === project.id) + 1,
    total: all.length,
  };

  const story = detail.story;
  const hasStory = Boolean(story.problem || story.approach || story.outcome);
  const hasOverview =
    detail.features.length > 0 || detail.responsibilities.length > 0;
  const hasCase = hasStory || detail.challenges.length > 0;
  const hasArchitecture = Boolean(detail.architecture);
  const hasTech = detail.technologies.length > 0;
  const hasGallery = detail.gallery.length > 0;

  useSEO({
    title: detail.title,
    description: detail.description.slice(0, 150),
  });
  let counter = 0;
  const nextIndex = () => `04.${++counter}`;

  return (
    <main ref={pageRef} className="bg-ink">
      <ProjectHero project={detail} position={position} />

      {hasOverview && <ProjectOverview index={nextIndex()} project={detail} />}

      {hasCase && (
        <ProjectStory
          index={nextIndex()}
          story={story}
          challenges={detail.challenges}
          solutions={detail.solutions}
        />
      )}

      {detail.architecture && (
        <ArchitectureSection
          index={nextIndex()}
          architecture={detail.architecture}
        />
      )}

      {hasTech && <ProjectTechStack index={nextIndex()} project={detail} />}

      {hasGallery && <ProjectGallery index={nextIndex()} project={detail} />}

      {nextProject && <NextProject project={nextProject} />}
    </main>
  );
}

function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? projectRepository.getBySlug(slug) : undefined;

  if (!project) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 text-center">
        <p className="label text-alert">[ 404 ] PROJECT NOT FOUND</p>
        <Link
          to="/projects"
          className="bar-select label border border-gold/60 px-5 py-3"
        >
          ← Back to projects
        </Link>
      </main>
    );
  }

  return <ProjectDetailView key={project.slug} project={project} />;
}

export default ProjectDetail;
