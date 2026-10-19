import type { Project } from "../entities/Project";
import type { DeveloperContext } from "../components/Ai/context/AiContext";
import type { Profile } from "../data/profile";
import type {
  ArchitectureNode,
  ProjectArchitectureModel,
} from "../models/ProjectArchitectureModel";
import type { ProjectStoryModel } from "../models/ProjectStoryModel";

type NodeTranslation = {
  title?: string;
  description?: string;
  details?: string;
};

export type ProjectTranslation = {
  title?: string;
  summary?: string;
  description?: string;
  features?: string[];
  responsibilities?: string[];
  challenges?: string[];
  solutions?: string[];
  story?: Partial<ProjectStoryModel>;

  /** key = gallery image id, e.g. "gallery-1" */
  gallery?: Record<string, { title?: string; description?: string }>;

  architecture?: {
    title?: string;
    description?: string;
    /** key = node id, e.g. "data-layer" */
    nodes?: Record<string, NodeTranslation>;
  };
};

export type ProfileTranslation = Partial<
  Pick<Profile, "headline" | "intro" | "status" | "location">
> & {
  /** key = English group title, value = translated title */
  skillGroupTitles?: Record<string, string>;
};

export type DeveloperContextTranslation = Partial<
  Pick<DeveloperContext, "role" | "description" | "background" | "goals">
>;

/** use the translation when it is a non-empty array, otherwise the original */
const pickList = (translated: string[] | undefined, original: string[]) =>
  translated && translated.length > 0 ? translated : original;

function translateNode(
  node: ArchitectureNode,
  nodes: Record<string, NodeTranslation> | undefined,
): ArchitectureNode {
  const tr = nodes?.[node.id];

  return {
    ...node,
    title: tr?.title ?? node.title,
    description: tr?.description ?? node.description,
    details: tr?.details ?? node.details,
    children: node.children?.map((child) => translateNode(child, nodes)),
  };
}

function translateArchitecture(
  architecture: ProjectArchitectureModel | undefined,
  tr: ProjectTranslation["architecture"],
): ProjectArchitectureModel | undefined {
  if (!architecture || !tr) {
    return architecture;
  }

  return {
    title: tr.title ?? architecture.title,
    description: tr.description ?? architecture.description,
    root: translateNode(architecture.root, tr.nodes),
  };
}

export function localizeProject(
  project: Project,
  tr: ProjectTranslation | undefined,
): Project {
  if (!tr) {
    return project;
  }

  return {
    ...project,

    title: tr.title ?? project.title,
    summary: tr.summary ?? project.summary,
    description: tr.description ?? project.description,

    features: pickList(tr.features, project.features),
    responsibilities: pickList(tr.responsibilities, project.responsibilities),
    challenges: pickList(tr.challenges, project.challenges),
    solutions: pickList(tr.solutions, project.solutions),

    story: { ...project.story, ...tr.story },

    gallery: project.gallery.map((image) => ({
      ...image,
      title: tr.gallery?.[image.id]?.title ?? image.title,
      description: tr.gallery?.[image.id]?.description ?? image.description,
    })),

    architecture: translateArchitecture(project.architecture, tr.architecture),
  };
}

export function localizeProfile(
  profile: Profile,
  tr: ProfileTranslation | undefined,
): Profile {
  if (!tr) {
    return profile;
  }

  return {
    ...profile,

    headline: pickList(tr.headline, profile.headline),
    intro: pickList(tr.intro, profile.intro),
    status: tr.status ?? profile.status,
    location: tr.location ?? profile.location,

    skillGroups: profile.skillGroups.map((group) => ({
      ...group,
      title: tr.skillGroupTitles?.[group.title] ?? group.title,
    })),
  };
}

export function localizeDeveloperContext(
  context: DeveloperContext,
  tr: DeveloperContextTranslation | undefined,
): DeveloperContext {
  if (!tr) {
    return context;
  }

  return {
    ...context,
    role: tr.role ?? context.role,
    description: tr.description ?? context.description,
    background: pickList(tr.background, context.background),
    goals: pickList(tr.goals, context.goals),
  };
}