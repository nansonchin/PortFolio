import { parseCommand } from "../components/TerminalAssistant/commands/parseCommand";
import { searchProjects } from "./searchProjects";

export async function parseTerminalInput(input: string) {
  const commandResult = await parseCommand(input);

  /**
   *
   * Real commands have priority
   *
   */
  if (commandResult.type !== "unknown") {
    return commandResult;
  }

  const projects = searchProjects(input);

  if (projects.length) {
    return {
      type: "project" as const,

      projects,

      lines: [`Found ${projects.length} project(s)`],
    };
  }

  return {
    type: "unknown" as const,

    lines: [
      `Unknown command: "${input}"`,

      `Type "help" to see available commands`,
    ],
  };
}
