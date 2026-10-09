type TerminalHeaderProps = {
  onClose: () => void;
};

export default function TerminalHeader({ onClose }: TerminalHeaderProps) {
  return (
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
          className="
text-xs
tracking-[0.15em]
text-[#D8BD83]
"
        >
          DEVELOPER TERMINAL
        </h2>
      </div>

      <button
        onClick={onClose}
        className="
text-neutral-400
"
      >
        ×
      </button>
    </header>
  );
}
