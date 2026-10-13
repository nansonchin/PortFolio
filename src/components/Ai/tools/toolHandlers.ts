import { projectRepository } from "../../../repository/ProjectRepository";
import { resolveNavigationPath } from "../../TerminalAssistant/Navigations/navigationService";
import type { AiToolCall, AiToolResult } from "../provider/aiProvider.types";

export type ToolContext = { 
    navigate: (path: string) => void,
    openExternal:(url:string)=> void; 
};

export function executeTool(call: AiToolCall, ctx: ToolContext): AiToolResult {
  switch (call.name) {
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

      ctx.navigate(resolveNavigationPath({ type: "project", slug }));
      return {
        name: call.name,
        response: { success: true, opened: project.title },
      };
    }

    case "open_project_link":{
        const slug = String(call.args.slug ?? "")
        const link = String(call.args.link?? "");
        const project= projectRepository.getBySlug(slug)

        if(!project){
            return{
                name:call.name,
                response:{
                    success:false,
                    error:`No project with slug "${slug}"`,
                    availableSlugs:projectRepository.getAll().map((p)=>p.slug)
                }
            }
        }

        const url = link ==="github"? project.githubUrl
                    : link ==="demo"?project.demoUrl
                    : undefined

        if(!url){
            return{
                name:call.name,
                response:{
                    success:false,error:`${project.title} has no ${link} link`
                }
            }
        }

        ctx.openExternal(url);
        return{
            name:call.name,
            response:{
                success:true,opened:`${project.title} (${link})`,url
            }
        }
    }

    case "navigate_to_page": {
      const page = String(call.args.page ?? "") as
        | "home"
        | "projects"
        | "about";
      if (!["home", "projects", "about"].includes(page)) {
        return {
          name: call.name,
          response: { success: false, error: "Unknown page" },
        };
      }
      ctx.navigate(resolveNavigationPath({ type: "page", target: page }));
      return { name: call.name, response: { success: true, opened: page } };
    }

    default:
      return {
        name: call.name,
        response: { success: false, error: "Unknown tool" },
      };
  }
}
