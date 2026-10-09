
import { useEffect, useRef, useState } from "react";
import { parseCommand } from "./commands/parseCommand";
import React from "react";

type TerminalAssistantProps = {
  // Later phases can add navigation and command handling here.
};

export default function TerminalAssistant(_props: TerminalAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Welcome to the developer terminal.",
    "Explore this portfolio through commands.",
    "Type a command to get started.",
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCommand = command.trim();

    if (!trimmedCommand) return;

    const result = parseCommand(trimmedCommand)

    if(result.type === "clear"){
        setHistory(result.lines);
        setCommand("")
        return;
    }

    setHistory((previous) => [
      ...previous,
      `> ${trimmedCommand}`,
      ...result.lines
    ]);

    setCommand("");
  }

  return (
    <React.Fragment>
      {/* Floating terminal toggle */}
      <button
        type="button"
        aria-label={isOpen ? "Close terminal" : "Open terminal"}
        aria-expanded={isOpen}
        aria-controls="portfolio-terminal"
        onClick={() => setIsOpen((previous) => !previous)}
        className="fixed bottom-6 left-6 z-[10000] flex h-14 items-center gap-3 rounded-full border border-[#C9A96E]/50 bg-[#0B0B0B] px-5 text-[#D8BD83] shadow-[0_0_25px_rgba(201,169,110,0.12)] transition-all duration-300 hover:border-[#D8BD83] hover:shadow-[0_0_30px_rgba(201,169,110,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BD83]"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
        >
          <path
            d="m7 5 7 7-7 7M14 19h7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="text-xs font-medium tracking-[0.18em]">
          TERMINAL
        </span>

        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full bg-[#D8BD83] transition-opacity ${
            isOpen ? "opacity-100" : "animate-pulse opacity-70"
          }`}
        />
      </button>

      {/* Terminal panel */}
      {isOpen && (
        <section
          id="portfolio-terminal"
          role="dialog"
          aria-modal="false"
          aria-labelledby="terminal-title"
          className="fixed bottom-24 left-4 z-[9999] flex h-[min(500px,65vh)] w-[min(92vw,480px)] flex-col overflow-hidden rounded-xl border border-[#C9A96E]/40 bg-[#090909] text-[#F5F5F5] shadow-[0_20px_80px_rgba(0,0,0,0.65)]"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#C9A96E]/20 bg-[#101010] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D8BD83]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#555555]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#555555]" />
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
              aria-label="Close terminal"
              onClick={() => setIsOpen(false)}
              className="rounded px-2 py-1 text-lg leading-none text-neutral-400 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BD83]"
            >
              ×
            </button>
          </header>

          {/* Output */}
          <div
            className="min-h-0 flex-1 overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm"
            aria-live="polite"
            aria-relevant="additions"
          >
            <p className="mb-3 text-[#D8BD83]">
              Portfolio System <span className="text-neutral-500">[UI]</span>
            </p>

            {history.map((line, index) => (
              <p
                key={`${index}-${line}`}
                className={
                  line.startsWith(">")
                    ? "break-words text-[#F5F5F5]"
                    : "break-words text-neutral-400"
                }
              >
                {line}
              </p>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-[#C9A96E]/20 bg-[#101010] px-4 py-3"
          >
            <label
              htmlFor="terminal-command"
              className="font-mono text-sm text-[#D8BD83]"
            >
              {">"}
            </label>

            <input
              ref={inputRef}
              id="terminal-command"
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="Type a command..."
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-neutral-600"
            />

            <button
              type="submit"
              className="rounded border border-[#C9A96E]/30 px-2 py-1 text-[10px] tracking-wider text-[#D8BD83] transition-colors hover:bg-[#C9A96E]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BD83]"
            >
              ENTER
            </button>
          </form>

          <footer className="border-t border-white/5 px-4 py-2 text-[10px] text-neutral-600">
            ESC TO CLOSE
          </footer>
        </section>
      )}
    </React.Fragment>
  );
}