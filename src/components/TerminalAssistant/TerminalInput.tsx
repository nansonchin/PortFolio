import type React from "react";

type TerminalInputProps = {
  value: string;

  onChange: (value: string) => void;

  onSubmit: () => void;

  onHistoryNavigate: (direction: "up" | "down") => void;
  isBusy: boolean;
  onStop: () => void;
};

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  onHistoryNavigate,
  isBusy,
  onStop,
}: TerminalInputProps) {
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      onHistoryNavigate("up");
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      onHistoryNavigate("down");
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (isBusy) {
        return;
      }

      onSubmit();
    }
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (isBusy || !value.trim()) {
          return;
        }

        onSubmit();
      }}
      aria-busy={isBusy}
      className="
            flex
            items-center
            gap-3
            border-t
            border-[#C9A96E]/20
            bg-[#101010]
            px-4
            py-3
            "
    >
      <label
        htmlFor="terminal-command"
        className="
                font-mono
                text-sm
                text-[#D8BD83]
                "
      >
        {">"}
      </label>

      <input
        maxLength={500}
        id="terminal-command"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        autoFocus
        placeholder={isBusy ? "Jarvis is responding..." : "Type a command ..."}
        className="
                min-w-0
                flex-1
                bg-transparent
                font-mono
                text-sm
                text-white
                outline-none
                placeholder:text-neutral-600
                "
      />
      {isBusy ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="
                rounded
                border
                border-[#C9A96E]/60
                bg-[#C9A96E]/10
                px-2
                py-1
                text-[10px]
                tracking-wider
                text-[#D8BD83]
                transition-colors
                hover:bg-[#C9A96E]/20
                "
        >
          ■ STOP
        </button>
      ) : (
        <button
          type="submit"
          className="
                rounded
                border
                border-[#C9A96E]/30
                px-2
                py-1
                text-[10px]
                tracking-wider
                text-[#D8BD83]
                transition-colors
                hover:bg-[#C9A96E]/10
                "
        >
          ENTER
        </button>
      )}
    </form>
  );
}
