import { searchProjects } from "../../../features/assitant/services/projectSearchService";
import { buildProjectContext } from "../context/buildProjectAiContextMapper";

export function projectTool(input: string) {
  const projects = buildProjectContext();

  const result = searchProjects(input, projects);

  if (result.length === 0) {
    return {
      success: false,

      message: "No project found.",
    };
  }

  return {
    success: true,

    data: result[0],

    message: `Found ${result[0].project.title}`,
  };
}
