export type LightboxButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
};

function LightboxButton({ children, onClick, ariaLabel }: LightboxButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="bar-select label border border-gold/60 px-5 py-3"
    >
      {children}
    </button>
  );
}

export default LightboxButton;