import type { AssistantResponse } from "../../../features/assitant/ai/assistant.types";
import type { AssistantDecision } from "../../../features/assitant/decisions/decision.type";
import type { ExecutePlanResult } from "../../../features/assitant/planner/planExecutor";
import type { SearchResult } from "../../../features/assitant/types/searchResult";

type BuildResponseArgs = {
  decision: AssistantDecision;

  execution: ExecutePlanResult;

  bestMatch?: SearchResult;
};
    
export function buildOrchestratorResponse({
  decision,

  execution,

  bestMatch,
}: BuildResponseArgs): AssistantResponse {
  switch (decision.type) {
    /**
     * ==========================
     * Navigate
     * ==========================
     *
     * Rule AI already knows:
     *
     * - project
     * - route
     *
     * No Gemini needed
     */
    case "navigate": {
      return {
        intent: "navigate",

        handled: true,

        message: `

I found ${bestMatch?.project.title}.


Execution:

${execution.logs.join("\n")}

        `,

        action: {
          type: "navigate",

          path: decision.path,
        },
      };
    }

    /**
     * ==========================
     * Ask User
     * ==========================
     *
     * Example:
     *
     * "Which project?"
     *
     * Need user information first
     */
    case "ask": {
      return {
        intent: "general",

        handled: true,

        message: decision.question,
      };
    }

    /**
     * ==========================
     * Answer
     * ==========================
     *
     * Rule AI has knowledge
     *
     */
    case "answer": {
      return {
        intent: "project_info",

        handled: true,

        message: execution.message,
      };
    }

    /**
     * ==========================
     * Unknown / General
     * ==========================
     *
     * IMPORTANT
     *
     * Let Gemini handle it
     */
    default: {
      return {
        intent: "general",

        handled: false,

        message: "",
      };
    }
  }
}
