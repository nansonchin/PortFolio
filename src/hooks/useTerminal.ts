import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { TerminalMessage } from "../types/terminal.types";

import { askTerminalAI } from "../components/Ai/services/terminalAIService";

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
   * Input command
   */
  const [command, setCommand] = useState("");

  /**
   * Terminal output
   */
  const [history, setHistory] = useState<TerminalMessage[]>([
    createTerminalMessage("system", "Welcome to the developer terminal."),

    createTerminalMessage("system", "Explore this portfolio through commands."),

    createTerminalMessage("system", "Type a command to get started."),
  ]);

  /**
   * Command history
   */
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

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

  function navigateHistory(direction: "up" | "down") {
    if (commandHistory.length === 0) {
      return;
    }

    if (direction === "up") {
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);

      setHistoryIndex(newIndex);

      setCommand(commandHistory[commandHistory.length - 1 - newIndex]);

      return;
    }

    if (direction === "down") {
      const newIndex = historyIndex - 1;

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

    setCommandHistory((previous) => [...previous, trimmedCommand]);

    setHistoryIndex(-1);

    /**
     * User command
     */

    setHistory((previous) => [
      ...previous,

      createTerminalMessage("command", `> ${trimmedCommand}`),
    ]);

    try {
      const response = await askTerminalAI(trimmedCommand);

      /**
       * AI Message
       */

      setHistory((previous) => [
        ...previous,

        createTerminalMessage(
          "output",

          response.message,
        ),
      ]);

      /**
       * Navigation Action
       */

      if (response.action?.type === "navigate") {
        navigate(response.action.path);
      }
    } catch (error) {
      setHistory((previous) => [
        ...previous,

        createTerminalMessage(
          "error",

          "AI service failed.",
        ),
      ]);
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
