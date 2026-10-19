import { projects } from "../data/project";
import type { Project } from "../entities/Project";
import { projectsZh } from "../il8n/contents/zh";
import { localizeProject, type ProjectTranslation } from "../il8n/localize";
import { DEFAULT_LANGUAGE, type Language } from "../il8n/types";
import type { ProjectStat } from "../models/ProjectStatsModel";

const translations: Partial<Record<Language, Record<string, ProjectTranslation>>> = {
  zh: projectsZh,
};

const cache = new Map<Language, Project[]>();

function listFor(lang: Language): Project[] {
  if (lang === DEFAULT_LANGUAGE) {
    return projects;
  }

  const cached = cache.get(lang);

  if (cached) {
    return cached;
  }

  const localized = projects.map((project) =>
    localizeProject(project, translations[lang]?.[project.slug]),
  );

  cache.set(lang, localized);

  return localized;
}

export class ProjectRepository {
  getAll(lang: Language = DEFAULT_LANGUAGE): Project[] {
    return listFor(lang);
  }

  getFeatures(lang: Language = DEFAULT_LANGUAGE): Project[] {
    return listFor(lang).filter((project) => project.featured);
  }

  getBySlug(slug: string, lang: Language = DEFAULT_LANGUAGE): Project | undefined {
    const key = slug.toLowerCase();

    return listFor(lang).find((project) => project.slug === key);
  }

  getNext(slug: string, lang: Language = DEFAULT_LANGUAGE): Project | undefined {
    const list = listFor(lang);

    const key = slug.toLowerCase();

    const index = list.findIndex((project) => project.slug.toLowerCase() === key);

    if (index === -1 || list.length < 2) {
      return undefined;
    }

    return list[(index + 1) % list.length];
  }

  getById(id: string, lang: Language = DEFAULT_LANGUAGE): Project | undefined {
    return listFor(lang).find((project) => project.id === id);
  }

  /** Returns translation KEYS as labels; the component calls t(label). */
  getStats(): ProjectStat[] {
    const technologies = new Set<string>();

    projects.forEach((project) => {
      project.technologies.forEach((tech) => technologies.add(tech));
    });

    return [
      { label: "stats.projects", value: `${projects.length}` },
      { label: "stats.technologies", value: `${technologies.size}+` },
      {
        label: "stats.featured",
        value: `${projects.filter((project) => project.featured).length}`,
      },
    ];
  }
}

export const projectRepository = new ProjectRepository();