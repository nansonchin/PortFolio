import type { TerminalCommandResult } from "../../../types/terminal.types";
import { terminalCommands } from "./terminalCommands";

export async function parseCommand(
  input: string,
): Promise<TerminalCommandResult | null> {
  const [commandName, ...args] = input.trim().toLowerCase().split(/\s+/);
  if (!commandName) return null;

  const matched = Object.values(terminalCommands).find(
    (c) => c.name === commandName || c.aliases?.includes(commandName),
  );

  if (!matched) return null;
  if (args.length > 0 && !matched.acceptsArgs) return null;

  return matched.execute(args);
}
