import { projectRepository } from "../../../repository/ProjectRepository";
import { resolveNavigationPath } from "../../TerminalAssistant/Navigations/navigationService";
import type { AiToolCall, AiToolResult } from "../provider/aiProvider.types";

const DETAILS_BUDGET = 2800;

function clip(text: string, max: number) {
  return text.length <= max ? text : text.slice(0, max - 1) + "…";
}

export type ToolContext = {
  navigate: (path: string) => void;
  openExternal: (url: string) => void;
};

function buildDetails(
  project: NonNullable<ReturnType<typeof projectRepository.getBySlug>>,
) {
  const details: Record<string, unknown> = {
    title: project.title,
    description: project.description,
    responsibilities: project.responsibilities,
    challenges: project.challenges,
    solutions: project.solutions,
  };

  if (project.architecture) {
    details.architecture = project.architecture;
  }

  // 超预算：先把 architecture 压成文字再逐步截断，最后截 description
  const size = () => JSON.stringify({ success: true, details }).length;

  if (size() > DETAILS_BUDGET && details.architecture) {
    details.architecture = clip(JSON.stringify(details.architecture), 900);
  }
  if (size() > DETAILS_BUDGET && details.architecture) {
    delete details.architecture;
    details.note =
      "Architecture omitted (too long). Offer to open the project page.";
  }
  if (size() > DETAILS_BUDGET) {
    details.description = clip(String(details.description ?? ""), 500);
  }

  return details;
}

export function executeTool(call: AiToolCall, ctx: ToolContext): AiToolResult {
  switch (call.name) {
    /* ============ navigate_to_project ============ */
    case "navigate_to_project": {
      const slug = String(call.args.slug ?? "");
      const project = projectRepository.getBySlug(slug);

      if (!project) {
        return {
          name: call.name,
          response: {
            success: false,
            error: `No project with slug "${slug}"`,
            availableSlugs: projectRepository.getAll().map((p) => p.slug),
          },
        };
      }

      const path = resolveNavigationPath({ type: "project", slug });

      /* 先闪烁，同时导航 */
      ctx.navigate(path);

      return {
        name: call.name,
        response: { success: true, opened: project.title },
      };
    }

    /* ============ navigate_to_page ============ */
    case "navigate_to_page": {
      const page = String(call.args.page ?? "") as
        | "home"
        | "projects"
        | "about"
        | "contact";

      if (!["home", "projects", "about", "contact"].includes(page)) {
        return {
          name: call.name,
          response: { success: false, error: "Unknown page" },
        };
      }

      const path = resolveNavigationPath({ type: "page", target: page });

      ctx.navigate(path);

      return { name: call.name, response: { success: true, opened: page } };
    }

    /* ============ open_project_link ============ */
    case "open_project_link": {
      const slug = String(call.args.slug ?? "");
      const link = String(call.args.link ?? "");
      const project = projectRepository.getBySlug(slug);

      if (!project) {
        return {
          name: call.name,
          response: {
            success: false,
            error: `No project with slug "${slug}"`,
            availableSlugs: projectRepository.getAll().map((p) => p.slug),
          },
        };
      }

      const url =
        link === "github"
          ? project.githubUrl
          : link === "demo"
            ? project.demoUrl
            : undefined;

      if (!url) {
        return {
          name: call.name,
          response: {
            success: false,
            error: `${project.title} has no ${link} link`,
          },
        };
      }

      ctx.openExternal(url);

      return {
        name: call.name,
        response: { success: true, opened: `${project.title} (${link})`, url },
      };
    }

    /* ============ filter_projects ============ */
    case "filter_projects": {
      const category =
        typeof call.args.category === "string" ? call.args.category.trim() : "";
      const search =
        typeof call.args.search === "string" ? call.args.search.trim() : "";

      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (search) params.set("search", search);

      const queryString = params.toString();
      const url =
        queryString.length > 0 ? "/projects?" + queryString : "/projects";

      ctx.navigate(url);

      return {
        name: call.name,
        response: {
          success: true,
          navigatedTo: url,
          applied: { category: category || "All", search: search || "(none)" },
        },
      };
    }
    /* ============ get_project_details（只读，不导航）============ */
    case "get_project_details": {
      const slug = String(call.args.slug ?? "");
      const project = projectRepository.getBySlug(slug);

      if (!project) {
        return {
          name: call.name,
          response: {
            success: false,
            error: `No project with slug "${slug}"`,
            availableSlugs: projectRepository.getAll().map((p) => p.slug),
          },
        };
      }

      return {
        name: call.name,
        response: { success: true, details: buildDetails(project) },
      };
    }

    default:
      return {
        name: call.name,
        response: { success: false, error: "Unknown tool" },
      };
  }
}
