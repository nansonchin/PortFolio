import { executeTool } from "../../../components/Ai/tools/toolExecutor";

import { setCurrentProject } from "../memory/assistantMemory";

import type { SearchResult } from "../types/searchResult";

import type { AssistantPlan } from "./planner.type";

type ExecutePlanArgs = {
  plan: AssistantPlan;

  projectResult?: SearchResult;
};

export type ExecutePlanResult = {
  success: boolean;

  message: string;

  logs: string[];

  path?: string;
};

export function executePlan({
  plan,
  projectResult,
}: ExecutePlanArgs): ExecutePlanResult {
  const logs: string[] = [];

  let navigationPath: string | undefined;

  for (const step of plan.steps) {
    switch (step) {
      /**
       * =========================
       * Search Project
       * =========================
       */

      case "search_project": {
        if (!projectResult) {
          return {
            success: false,

            message: "No project found.",

            logs,
          };
        }

        logs.push(`Found ${projectResult.project.title}`);

        break;
      }

      /**
       * =========================
       * Load Memory
       * =========================
       */

      case "load_project_memory": {
        if (projectResult) {
          setCurrentProject(projectResult.project);

          logs.push(`Loaded ${projectResult.project.title} into memory`);
        }

        break;
      }

      /**
       * =========================
       * Navigate
       * =========================
       */

      case "navigate": {
        if (!projectResult) {
          return {
            success: false,

            message: "Cannot navigate without project.",

            logs,
          };
        }

        navigationPath = `/project/${projectResult.project.slug}`;

        const result = executeTool({
          tool: "navigate",

          input: navigationPath,
        });

        logs.push(result.message);

        return {
          success: result.success,

          message: result.message,

          logs,

          path: navigationPath,
        };
      }

      /**
       * =========================
       * Answer
       * =========================
       */

      case "answer": {
        logs.push("Preparing answer...");

        break;
      }
    }
  }

  return {
    success: true,

    message: logs.join("\n"),

    logs,

    path: navigationPath,
  };
}
