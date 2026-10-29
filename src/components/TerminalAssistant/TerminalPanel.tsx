import { useEffect, useRef } from "react";
import { useTerminalScroll } from "../../hooks/useTerminalScroll";
import type { TerminalMessage } from "../../types/terminal.types";
import SuggestedQuestions from "./SuggestedQuestions";
import TerminalInput from "./TerminalInput";
import TerminalMessages from "./TerminalMessages";
import { SUGGESTED_QUESTIONS } from "../../hooks/useTerminal";

type TerminalPanelProps = {
  history: TerminalMessage[];
  isThinking: boolean;
  command: string;
  onChangeCommand: (value: string) => void;
  onHistoryNavigate: (direction: "up" | "down") => void;
  onSubmit: () => void;
  onStop:()=>void;
  onClose: () => void;
  showSuggestions: boolean;
  onSelectSuggestion: (question: string) => void;
};

export default function TerminalPanel({
  history,
  isThinking,
  command,
  onChangeCommand,
  onHistoryNavigate,
  onSubmit,
  onStop,
  onClose,
  showSuggestions,
  onSelectSuggestion,
}: TerminalPanelProps) {
  // 消息数量、thinking 状态、最后一条消息的长度（流式输出时它会一直变长）变化时才跟随滚动。
  // 不要把 command（输入框内容）放进依赖，否则每敲一个字都会触发。
  // 是否真的滚动由 useTerminalScroll 决定：用户在底部附近才跟随。
   const last = history[history.length - 1];
  const lastLength = last?.text.length ?? 0;
  const terminalRef = useTerminalScroll(`${history.length}:${isThinking}:${lastLength}`);
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleWheel = (event: WheelEvent) => {
      event.stopPropagation();
      if (!terminalRef.current?.contains(event.target as Node)) {
        event.preventDefault();
      }
    };

    panel.addEventListener("wheel", handleWheel, { passive: false });
    return () => panel.removeEventListener("wheel", handleWheel);
  }, [terminalRef]);

  return (
    <section
      ref={panelRef}
      id="portfolio-terminal"
      role="dialog"
      aria-modal="false"
      aria-labelledby="terminal-title"
      className="
        fixed bottom-24 right-3
        z-[9999]
        flex h-[min(500px,65vh)] w-[min(92vw,480px)]
        flex-col overflow-hidden
        rounded-xl border border-[#C9A96E]/40
        bg-[#090909] text-[#F5F5F5]
        shadow-[0_20px_80px_rgba(0,0,0,0.65)]
      "
    >
      <header className="flex items-center justify-between border-b border-[#C9A96E]/20 bg-[#101010] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D8BD83]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#555]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#555]" />
          </div>
          <h2
            id="terminal-title"
            className="text-xs font-medium tracking-[0.15em] text-[#D8BD83]"
          >
            DEVELOPER TERMINAL
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close terminal"
          className="rounded px-2 py-1 text-lg text-neutral-400 hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
      </header>

      <div
        ref={terminalRef}
        data-lenis-prevent
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 font-mono text-xs leading-6 sm:text-sm"
      >
        <p className="mb-4 text-[#D8BD83]">
          Portfolio System <span className="text-neutral-500">[UI]</span>
        </p>

        <TerminalMessages history={history} isThinking={isThinking} />

        <SuggestedQuestions
          questions={[...SUGGESTED_QUESTIONS]}
          onSelect={onSelectSuggestion}
          visible={showSuggestions}
        />
      </div>

      <TerminalInput
        value={command}
        onChange={onChangeCommand}
        onSubmit={onSubmit}
        onHistoryNavigate={onHistoryNavigate}
        isBusy={isThinking}
        onStop={onStop}
      />

      <footer className="border-t border-white/5 px-4 py-2 text-[10px] text-neutral-600">
        ESC TO CLOSE · PRESS / TO OPEN
      </footer>
    </section>
  );
}