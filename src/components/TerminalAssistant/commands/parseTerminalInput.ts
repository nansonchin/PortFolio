import { searchProjects } from "../../../utils/searchProjects";
import { parseCommand } from "./parseCommand";

import type { TerminalCommandResult } from "../../../types/terminal.types";

export async function parseTerminalInput(
  input: string,
): Promise<TerminalCommandResult> {
  /*
    --------------------------------
    Step 1
    Command Parser
    --------------------------------
    */

  const commandResult = await parseCommand(input);

  if (commandResult) {
    return commandResult;
  }

  /*
    --------------------------------
    Step 2
    Project Search
    --------------------------------
    */

  const projects = searchProjects(input);

  if (projects.length > 0) {
    return {
      type: "project",

      projects,

      lines: [`Found ${projects.length} project(s).`],
    };
  }

  /*
    --------------------------------
    Step 3
    Unknown
    --------------------------------
    */

  return {
    type: "unknown",

    lines: [
      `Unknown command: "${input}"`,

      'Type "help" to see available commands.',
    ],
  };
}
