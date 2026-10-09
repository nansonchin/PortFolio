import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { parseTerminalInput } from "../utils/terminalParser";
import type { TerminalMessage } from "../types/terminal.types";

function createTerminalMessage(
  type: TerminalMessage["type"],
  text: string,
): TerminalMessage {
  return {
    id: `${Date.now()}-${Math.random()}`,
    type,
    text,
  };
}

export function useTerminal() {
  const navigate = useNavigate();

  /**
   * Terminal open state
   */
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Current input value
   */
  const [command, setCommand] = useState("");

  /**
   * Terminal displayed messages
   */
  const [history, setHistory] = useState<TerminalMessage[]>([
    createTerminalMessage("system", "Welcome to the developer terminal."),

    createTerminalMessage("system", "Explore this portfolio through commands."),

    createTerminalMessage("system", "Type a command to get started."),
  ]);

  /**
   * Command history
   *
   * Example:
   *
   * [
   *   "help",
   *   "navigate projects"
   * ]
   */
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  /**
   * Current command history position
   *
   * -1 means normal typing mode
   */
  const [historyIndex, setHistoryIndex] = useState(-1);

  function toggle() {
    setIsOpen((previous) => !previous);
  }

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  /**
   * Arrow Up / Arrow Down handler
   */
  function navigateHistory(direction: "up" | "down") {
    if (commandHistory.length === 0) {
      return;
    }

    /**
     * Go older command
     */
    if (direction === "up") {
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);

      setHistoryIndex(newIndex);

      setCommand(commandHistory[commandHistory.length - 1 - newIndex]);

      return;
    }

    /**
     * Go newer command
     */
    if (direction === "down") {
      const newIndex = historyIndex - 1;

      /**
       * Return to empty input
       */
      if (newIndex < 0) {
        setHistoryIndex(-1);

        setCommand("");

        return;
      }

      setHistoryIndex(newIndex);

      setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
    }
  }

  async function submit() {
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      return;
    }

    /**
     * Save command
     */
    setCommandHistory((previous) => [...previous, trimmedCommand]);

    /**
     * Reset history pointer
     */
    setHistoryIndex(-1);

    const result = await parseTerminalInput(trimmedCommand);

    switch (result.type) {
      case "clear":
        setHistory([createTerminalMessage("system", "Terminal cleared.")]);

        break;

      case "navigation":
        setHistory((previous) => [
          ...previous,

          createTerminalMessage("command", `> ${trimmedCommand}`),

          ...result.lines.map((line) => createTerminalMessage("success", line)),
        ]);

        navigate(result.path);

        break;

      case "output":
        setHistory((previous) => [
          ...previous,

          createTerminalMessage("command", `> ${trimmedCommand}`),

          ...result.lines.map((line) => createTerminalMessage("output", line)),
        ]);
        break;
      case "unknown":
        setHistory((previous) => [
          ...previous,

          createTerminalMessage("command", `> ${trimmedCommand}`),

          ...result.lines.map((line) => createTerminalMessage("error", line)),
        ]);
        break;

      case "project":
        setHistory((previous) => [
          ...previous,

          createTerminalMessage("command", `> ${trimmedCommand}`),

          ...result.lines.map((line) => createTerminalMessage("output", line)),
        ]);

        break;

      default:
        break;
    }

    setCommand("");
  }

  return {
    isOpen,

    command,

    history,

    setCommand,

    toggle,

    open,

    close,

    submit,

    navigateHistory,
  };
}
