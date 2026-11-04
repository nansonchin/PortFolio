import type { Project } from "../../entities/Project";

export type PortfolioSnapshot={
    version:1,
    generatedAt:string;
    projects:   Project[]
}

function isRecord (value:unknown):value is Record<string,unknown>{
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

export function isPortfolioSnapshot(value: unknown): value is PortfolioSnapshot {
  return (
    isRecord(value) &&
    value.version === 1 &&
    isString(value.generatedAt) &&
    Array.isArray(value.projects) &&
    value.projects.length > 0 &&
    value.projects.every(isProject)
  );
}