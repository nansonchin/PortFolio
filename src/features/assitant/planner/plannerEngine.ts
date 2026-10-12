import type { AssistantDecision } from "../decisions/decision.type";
import type { AssistantPlan } from "./planner.type";

export function createPlan(decision: AssistantDecision): AssistantPlan {
  switch (decision.type) {
    case "navigate":
      return {
        goal: "Navigate usr to requested project",
        steps: ["search_project", "load_project_memory", "navigate"],
      };
    case "answer":
      return {
        goal: "ANswer user question",
        steps: ["load_project_memory", "answer"],
      };
    case "ask":
      return {
        goal: "Collect more informaton",
        steps: ["answer"],
      };
    case "general":
      return {
        goal: "Continue general conversation",

        steps: ["conversation"],
      };
  }
}
