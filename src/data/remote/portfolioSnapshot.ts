import type { DeveloperContext } from "../../components/Ai/context/AiContext";
import type { Project } from "../../entities/Project";
import type { DeveloperContextTranslation, ProfileTranslation, ProjectTranslation } from "../../il8n/localize";
import type { Profile } from "../profile";

export type PortfolioSnapshot = {
  version: 1;
  generatedAt: string;
  projects: Project[];
  translations?: { zh?: Record<string, ProjectTranslation> };
    site?: unknown;
};

export type SiteData = {
  profile?: Profile;
  developerContext?: DeveloperContext;
  translations?: {
    zh?: {
      profile?: ProfileTranslation;
      developerContext?: DeveloperContextTranslation;
    };
  };
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


function isSkillGroup(value: unknown): boolean {
  return isRecord(value) && isString(value.title) && isStringArray(value.items);
}

function isProfile(value: unknown): value is Profile {
  return (
    isRecord(value) &&
    isStringArray(value.headline) &&
    isStringArray(value.intro) &&
    isString(value.location) &&
    isString(value.status) &&
    isString(value.email) &&
    isString(value.github) &&
    isString(value.linkedin) &&
    isStringArray(value.focus) &&
    Array.isArray(value.skillGroups) &&
    value.skillGroups.every(isSkillGroup)
  );
}

function isDeveloperContext(value: unknown): value is DeveloperContext {
  return (
    isRecord(value) &&
    isString(value.name) &&
    isString(value.role) &&
    isString(value.description) &&
    isStringArray(value.background) &&
    isStringArray(value.skills) &&
    isStringArray(value.goals)
  );
}

function isProfileTranslation(value: unknown): value is ProfileTranslation {
  if (!isRecord(value)) return false;

  const titles = value.skillGroupTitles;

  return (
    (value.headline === undefined || isStringArray(value.headline)) &&
    (value.intro === undefined || isStringArray(value.intro)) &&
    (value.status === undefined || isString(value.status)) &&
    (value.location === undefined || isString(value.location)) &&
    (titles === undefined || (isRecord(titles) && Object.values(titles).every(isString)))
  );
}

function isDeveloperTranslation(value: unknown): value is DeveloperContextTranslation {
  return (
    isRecord(value) &&
    (value.role === undefined || isString(value.role)) &&
    (value.description === undefined || isString(value.description)) &&
    (value.background === undefined || isStringArray(value.background)) &&
    (value.goals === undefined || isStringArray(value.goals))
  );
}

export function readSite(snapshot: PortfolioSnapshot): SiteData | undefined {
  const site = snapshot.site;
  if (!isRecord(site)) return undefined;

  const result: SiteData = {};

  if (isProfile(site.profile)) result.profile = site.profile;
  if (isDeveloperContext(site.developerContext)) result.developerContext = site.developerContext;

  const translations = site.translations;
  const zh = isRecord(translations) ? translations.zh : undefined;

  if (isRecord(zh)) {
    const validZh: NonNullable<SiteData["translations"]>["zh"] = {};

    if (isProfileTranslation(zh.profile)) validZh.profile = zh.profile;
    if (isDeveloperTranslation(zh.developerContext)) {
      validZh.developerContext = zh.developerContext;
    }

    result.translations = { zh: validZh };
  }

  return result;
}