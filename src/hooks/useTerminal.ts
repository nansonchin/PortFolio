import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { parseTerminalInput } from "../utils/terminalParser";

export function useTerminal() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [command, setCommand] = useState("");

  const [history, setHistory] = useState<string[]>([
    "Welcome to the developer terminal.",
    "Explore this portfolio through commands.",
    "Type a command to get started.",
  ]);

  /**
   * Real command history
   *
   * For ↑ ↓ navigation
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

  function handleHistoryNavigation(direction: "up" | "down") {
    if (commandHistory.length === 0) {
      return;
    }

    if (direction === "up") {
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);

      setHistoryIndex(newIndex);

      setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
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

    /**
     * Save command
     */
    setCommandHistory((previous) => [...previous, trimmedCommand]);

    setHistoryIndex(-1);

    const result = await parseTerminalInput(trimmedCommand);

    switch (result.type) {
      case "clear":
        setHistory([]);

        break;

      case "navigation":
        setHistory((previous) => [
          ...previous,
          `> ${trimmedCommand}`,
          ...result.lines,
        ]);

        navigate(result.path);

        break;

      case "output":

      case "unknown":

      case "project":
        setHistory((previous) => [
          ...previous,
          `> ${trimmedCommand}`,
          ...result.lines,
        ]);

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

    handleHistoryNavigation,
  };
}
