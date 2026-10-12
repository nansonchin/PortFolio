import { projectTool } from "./projectTool";

import { navigateTool } from "./navigateTool";
import type { ToolRequest } from "./aiTool.types";

export function executeTool(request: ToolRequest) {
  switch (request.tool) {
    case "project_search":
      return projectTool(request.input);

    case "navigate":
      return navigateTool(request.input);

    default:
      return {
        success: false,

        message: "Unknown tool.",
      };
  }
}
