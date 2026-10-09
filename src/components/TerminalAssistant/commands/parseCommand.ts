import type { TerminalCommandResult } from "../../../types/terminal.types";
import { terminalCommands } from "./terminalCommands";

export async function parseCommand(
  input: string,
): Promise<TerminalCommandResult> {
  const parts = input.trim().toLowerCase().split(/\s+/);

  const commandName = parts[0];

  const args = parts.slice(1);

  if (!commandName) {
    return {
      type: "output",

      lines: ["Please enter a command"],
    };
  }

  const matchedCommand = Object.values(terminalCommands).find(
    (command) =>
      command.name === commandName || command.aliases?.includes(commandName),
  );

  if (!matchedCommand) {
    return {
      type: "unknown",

      lines: [
        `Unknown command: "${commandName}"`,

        `Type "help" to see available commands`,
      ],
    };
  }

  return await matchedCommand.execute(args);
}
