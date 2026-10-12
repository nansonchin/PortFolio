import { developerContext } from "../../../data/developerContext";
import type { PortfolioContext } from "./AiContext";
import { buildProjectContext } from "./buildProjectAiContextMapper";

export function buildPortfolioContext():PortfolioContext{
    return{
        developer:developerContext,
        projects:buildProjectContext()
    }
}