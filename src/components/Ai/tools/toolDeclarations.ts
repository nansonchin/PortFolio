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
      "Open a main page of the portfolio: home, the projects list, the about page, or the contact page.",
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

  {
    name: "filter_projects",
    description:
      "Navigate to the projects page and apply a filter to show only relevant projects. " +
      "Use when the visitor asks to see projects of a specific type, category, or technology — " +
      "for example: 'show me your frontend projects', 'do you have any React work', " +
      "'show me animation projects', 'what Vue projects have you built'. " +
      "Prefer this over navigate_to_page when the visitor is asking about a category or technology." +
       "Call it every time the visitor asks, even if the same filter was applied earlier in the conversation - they may have left the projects page since.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "The project category to filter by. Must match exactly one of the categories in the project list. " +
            "Use 'All' to show all projects. Leave empty if filtering by search keyword instead.",
        },
        search: {
          type: "string",
          description:
            "A keyword to search by — matches project titles and technologies. " +
            "Use this when the visitor mentions a specific technology (e.g. 'Vue', 'GSAP', 'TypeScript') " +
            "that may not be a category name.",
        },
      },
    },
  },
];
