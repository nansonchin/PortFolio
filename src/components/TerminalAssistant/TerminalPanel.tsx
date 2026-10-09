import TerminalInput from "./TerminalInput";

type TerminalPanelProps = {
  history: string[];
  command: string;

  onChangeCommand: (value: string) => void;
   onHistoryNavigate:
    (
        direction:"up"|"down"
    )=>void;
  onSubmit: () => void;

  onClose: () => void;
};

export default function TerminalPanel({
  history,
  command,
  onChangeCommand,
  onHistoryNavigate,
  onSubmit,
  onClose,
}: TerminalPanelProps) {
  return (
    <section
      id="portfolio-terminal"
      role="dialog"
      aria-modal="false"
      aria-labelledby="terminal-title"
      className="
            fixed
            bottom-24
            left-4
            z-[9999]
            flex
            h-[min(500px,65vh)]
            w-[min(92vw,480px)]
            flex-col
            overflow-hidden
            rounded-xl
            border
            border-[#C9A96E]/40
            bg-[#090909]
            text-[#F5F5F5]
            shadow-[0_20px_80px_rgba(0,0,0,0.65)]
            "
    >
      {/* Header */}

      <header
        className="
                flex
                items-center
                justify-between
                border-b
                border-[#C9A96E]/20
                bg-[#101010]
                px-4
                py-3
                "
      >
        <div
          className="
                    flex
                    items-center
                    gap-3
                    "
        >
          <div
            className="
                        flex
                        gap-1.5
                        "
            aria-hidden="true"
          >
            <span
              className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#D8BD83]
                            "
            />

            <span
              className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#555]
                            "
            />

            <span
              className="
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#555]
                            "
            />
          </div>

          <h2
            id="terminal-title"
            className=" text-xs font-medium tracking-[0.15em] text-[#D8BD83]"
          >
            DEVELOPER TERMINAL
          </h2>
        </div>

        <button
          type="button"
          aria-label="Close terminal"
          onClick={onClose}
          className=" rounded px-2 py-1 text-lg leading-none text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          ×
        </button>
      </header>

      {/* Output */}

      <div
        className=" min-h-0 flex-1 overflow-y-auto px-4 py-4 font-mono text-xs leading-6 sm:text-sm"
        aria-live="polite"
        aria-relevant="additions"
      >
        <p
          className="mb-3 text-[#D8BD83]"
        >
          Portfolio System
          <span className="text-neutral-500"> [UI]</span>
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

      <TerminalInput
        value={command}
        onChange={onChangeCommand}
        onSubmit={onSubmit}
        onHistoryNavigate={onHistoryNavigate}
      />

      {/* Footer */}

      <footer
        className="
                border-t
                border-white/5
                px-4
                py-2
                text-[10px]
                text-neutral-600
                "
      >
        ESC TO CLOSE
      </footer>
    </section>
  );
}
