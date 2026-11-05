import type { Project } from "../../entities/Project";
import type { ProjectTranslation } from "../../il8n/localize";

export type PortfolioSnapshot = {
  version: 1;
  generatedAt: string;
  projects: Project[];
  translations?: { zh?: Record<string, ProjectTranslation> };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const isString = (value: unknown): value is string => typeof value === "string";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

function isProject(value: unknown): value is Project {
  if (!isRecord(value)) return false;

  const hero = value.heroImage;
  const story = value.story;

  return (
    isString(value.id) &&
    isString(value.slug) &&
    isString(value.title) &&
    isString(value.summary) &&
    isString(value.description) &&
    typeof value.year === "number" &&
    typeof value.featured === "boolean" &&
    isString(value.category) &&
    isString(value.githubUrl) &&
    isString(value.thumbnail) &&
    isStringArray(value.technologies) &&
    isStringArray(value.features) &&
    isStringArray(value.responsibilities) &&
    isStringArray(value.challenges) &&
    isStringArray(value.solutions) &&
    isRecord(hero) &&
    isString(hero.src) &&
    Array.isArray(value.gallery) &&
    isRecord(story) &&
    isString(story.problem) &&
    isString(story.approach) &&
    isString(story.outcome) &&
    isStringArray(story.architecture)
  );
}

export function isPortfolioSnapshot(
  value: unknown,
): value is PortfolioSnapshot {
  return (
    isRecord(value) &&
    value.version === 1 &&
    isString(value.generatedAt) &&
    Array.isArray(value.projects) &&
    value.projects.length > 0 &&
    value.projects.every(isProject)
  );
}

function isProjectTranslation(value: unknown): value is ProjectTranslation {
  if (!isRecord(value)) return false;

  const textOk = ["title", "summary", "description"].every(
    (key) => value[key] === undefined || isString(value[key]),
  );
  const listsOk = [
    "features",
    "responsibilities",
    "challenges",
    "solutions",
  ].every((key) => value[key] === undefined || isStringArray(value[key]));
  const story = value.story;
  const storyOk =
    story === undefined ||
    (isRecord(story) &&
      (story.architecture === undefined || isStringArray(story.architecture)));
  const galleryOk = value.gallery === undefined || isRecord(value.gallery);
  const architecture = value.architecture;
  const architectureOk =
    architecture === undefined ||
    (isRecord(architecture) &&
      (architecture.nodes === undefined || isRecord(architecture.nodes)));

  return textOk && listsOk && storyOk && galleryOk && architectureOk;
}


export function readZhTranslations(
  snapShot:PortfolioSnapshot
):Record<string,ProjectTranslation>|undefined{
  const zh= snapShot.translations?.zh;
  if(!isRecord(zh)){
    return  undefined;
  }

  const valid: Record<string , ProjectTranslation>={}

  for(const [slug,translation] of Object.entries(zh)){
    if(isProjectTranslation(translation)){
      valid[slug]=translation
    }
  }

  return valid;
}