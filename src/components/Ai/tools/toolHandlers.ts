import { projectRepository } from "../../../repository/ProjectRepository";
import { resolveNavigationPath } from "../../TerminalAssistant/Navigations/navigationService";
import { emitJarvisNavigate } from "../../TerminalAssistant/terminalEvent";
import type { AiToolCall, AiToolResult } from "../provider/aiProvider.types";

export type ToolContext = {
  navigate: (path: string) => void;
  openExternal: (url: string) => void;
};

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
      emitJarvisNavigate(path);
      ctx.navigate(path);

      return {
        name: call.name,
        response: { success: true, opened: project.title },
      };
    }

    /* ============ navigate_to_page ============ */
    case "navigate_to_page": {
      const page = String(call.args.page ?? "") as
        | "home" | "projects" | "about" | "contact";

      if (!["home", "projects", "about", "contact"].includes(page)) {
        return {
          name: call.name,
          response: { success: false, error: "Unknown page" },
        };
      }

      const path = resolveNavigationPath({ type: "page", target: page });

      emitJarvisNavigate(path);
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
        link === "github" ? project.githubUrl
        : link === "demo" ? project.demoUrl
        : undefined;

      if (!url) {
        return {
          name: call.name,
          response: { success: false, error: `${project.title} has no ${link} link` },
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
      const url = queryString.length > 0 ? "/projects?" + queryString : "/projects";

      emitJarvisNavigate(url);
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

    default:
      return {
        name: call.name,
        response: { success: false, error: "Unknown tool" },
      };
  }
}