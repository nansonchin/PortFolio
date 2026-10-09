type TerminalOutputProps = {
  history: string[];
};

export default function TerminalOutput({ history }: TerminalOutputProps) {
  return (
    <div
      className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            py-4
            font-mono
            text-xs
            leading-6
            sm:text-sm
            "
      aria-live="polite"
      aria-relevant="additions"
    >
      <p
        className="
                mb-3
                text-[#D8BD83]
                "
      >
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
  );
}
