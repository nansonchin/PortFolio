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
        | "about"
        | "contact"
      if (!["home", "projects", "about", "contact"].includes(page)) {
        return {
          name: call.name,
          response: { success: false, error: "Unknown page" },
        };
      }
      ctx.navigate(resolveNavigationPath({ type: "page", target: page }));
      return { name: call.name, response: { success: true, opened: page } };
    }
    case "filter_projects":{
      const category= typeof call.args.category === "string" ? call.args.category.trim():"";
      const search = typeof call.args.search ==="string"? call.args.search.trim():""

      const params = new URLSearchParams()
      if(category && category !=="All") params.set("category",category)
        if(search) params.set("search",search);

      const query = params.toString()
      const url = `/projects${query? `${query}`:""}`
      ctx.navigate(url)
      
      return{
        name:call.name,
        response:{
          success:true,
          navigateTo:url,
          applied:{
            category:category||"All",
            search:search||"(none)"
          }
        }
      }
    }
    default:
      return {
        name: call.name,
        response: { success: false, error: "Unknown tool" },
      };
  }
}
