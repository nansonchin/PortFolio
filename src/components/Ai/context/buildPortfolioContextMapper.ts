import { developerContext } from "../../../data/developerContext";
import { siteRepository } from "../../../repository/SiteRepository";
import type { PortfolioContext } from "./AiContext";
import { buildProjectContext } from "./buildProjectAiContextMapper";

export function buildPortfolioContext(): PortfolioContext {
  return {
    developer: siteRepository.getDeveloperContext(),
    projects: buildProjectContext(),
  };
}