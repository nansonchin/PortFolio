import { useEffect } from "react";
import { useTerminal } from "../../hooks/useTerminal";
import TerminalButton from "./TerminalButton";
import TerminalPanel from "./TerminalPanel";

type TerminalAssistantProps = {};

export default function TerminalAssistant(_props: TerminalAssistantProps) {
  const terminal = useTerminal();

  /**
   * ESC close
   */
  useEffect(() => {
    if (!terminal.isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        terminal.close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [terminal.isOpen, terminal.close]);

  return (
    <div data-cursor-ignore>
      <TerminalButton isOpen={terminal.isOpen} onToggle={terminal.toggle} />

      {terminal.isOpen && (
        <TerminalPanel
          history={terminal.history}
          command={terminal.command}
          onChangeCommand={terminal.setCommand}
          onSubmit={terminal.submit}
          onClose={terminal.close}
          onHistoryNavigate={terminal.handleHistoryNavigation}
        />
      )}
    </div>
  );
}
