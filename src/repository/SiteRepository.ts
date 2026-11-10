import type { DeveloperContext } from "../components/Ai/context/AiContext";
import { developerContext } from "../data/developerContext";
import { buildContactLinks, profile, type ContactLink, type Profile } from "../data/profile";
import type { SiteData } from "../data/remote/portfolioSnapshot";
import { developerContextZh, profileZh } from "../il8n/contents/zh";
import {
  localizeDeveloperContext,
  localizeProfile,
  type DeveloperContextTranslation,
  type ProfileTranslation,
} from "../il8n/localize";
import { DEFAULT_LANGUAGE, type Language } from "../il8n/types";

let profileSource: Profile = profile;
let developerSource: DeveloperContext = developerContext;
let profileZhSource: ProfileTranslation = profileZh;
let developerZhSource: DeveloperContextTranslation = developerContextZh;

const profileCache = new Map<Language, Profile>();
const developerCache = new Map<Language, DeveloperContext>();

export class SiteRepository {

  setSite(site: SiteData | undefined): void {
    profileSource = site?.profile ?? profile;
    developerSource = site?.developerContext ?? developerContext;
    profileZhSource = site?.translations?.zh?.profile ?? profileZh;
    developerZhSource = site?.translations?.zh?.developerContext ?? developerContextZh;

    profileCache.clear();
    developerCache.clear();
  }

  getProfile(lang: Language = DEFAULT_LANGUAGE): Profile {
    if (lang === DEFAULT_LANGUAGE) {
      return profileSource;
    }

    const cached = profileCache.get(lang);
    if (cached) return cached;

    const localized = localizeProfile(profileSource, lang === "zh" ? profileZhSource : undefined);
    profileCache.set(lang, localized);

    return localized;
  }

  getDeveloperContext(lang: Language = DEFAULT_LANGUAGE): DeveloperContext {
    if (lang === DEFAULT_LANGUAGE) {
      return developerSource;
    }

    const cached = developerCache.get(lang);
    if (cached) return cached;

    const localized = localizeDeveloperContext(
      developerSource,
      lang === "zh" ? developerZhSource : undefined,
    );
    developerCache.set(lang, localized);

    return localized;
  }

  getContactLinks(): ContactLink[] {
    return buildContactLinks(profileSource);
  }
}

export const siteRepository = new SiteRepository();