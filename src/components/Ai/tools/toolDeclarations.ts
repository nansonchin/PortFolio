import type { AiToolDeclaration } from "../provider/aiProvider.types";

export const portfolioTools: AiToolDeclaration[] = [
  {
    name: "navigate_to_project",
    description:
      "Open a project's detail page in the portfolio. Use when the visitor asks to show, open, view, visit or go to a specific project.",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "The exact slug of the project, taken from the project list.",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "navigate_to_page",
    description:
      "Open a main page of the portfolio: home, the projects list, or the about page.",
    parameters: {
      type: "object",
      properties: {
        page: {
          type: "string",
          description: "Which page to open.",
          enum: ["home", "projects", "about", "contact"],
        },
      },
      required: ["page"],
    },
  },
  {
    name: "open_project_link",
    description:
      "Open a project's external link in a new browser tab: ts GitHub respository or its live demo. Use when the visitor asks for the sourcce code, GitHub, repo, live demo, or live website of a project",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "The exact slug of the project. taken from the project list",
        },
        link: {
          type: "string",
          description: "which link to open",
          enum: ["github", "demo"],
        },
      },
      required: ["slug", "link"],
    },
  },
];
