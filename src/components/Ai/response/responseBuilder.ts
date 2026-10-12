import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";

import { buildNavigationResponse } from "./navigationResponse";

import { buildProjectInfoResponse } from "./projectInfoResponse";

import { buildArchitectureResponse } from "./architectureResponse";
import type { SearchResult } from "../../../features/assitant/types/searchResult";

export type AssistantResponseType =
  | "navigate"
  | "project_info"
  | "architecture";

type BuildAssistantResponseArgs = {
  type: AssistantResponseType;

  result?: SearchResult;

  project?: ProjectAiContext;

  toolMessage?: string;
};

export function buildAssistantResponseMessage({
  type,
  result,
  project,
  toolMessage,
}: BuildAssistantResponseArgs): string {
  switch (type) {
    /**
     * =========================
     * Navigation Response
     * =========================
     */

    case "navigate": {
      if (!result) {
        return "I couldn't find the project.";
      }

      return buildNavigationResponse({
        result,

        toolMessage: toolMessage ?? "",
      });
    }

    /**
     * =========================
     * Project Information
     * =========================
     */

    case "project_info": {
      if (!project) {
        return "Project information unavailable.";
      }

      return buildProjectInfoResponse(project);
    }

    /**
     * =========================
     * Architecture
     * =========================
     */

    case "architecture": {
      if (!project) {
        return "Architecture information unavailable.";
      }

      return buildArchitectureResponse(project);
    }
  }
}
