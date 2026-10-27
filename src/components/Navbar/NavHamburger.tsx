type NavHamburgerProps = {
  isOpen: boolean;
  onClick: () => void;
};

function NavHamburger({ isOpen, onClick }: NavHamburgerProps) {
  return (
    <button
      type="button"
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-nav"
      onClick={onClick}
      className="relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
    >
      <span
        className={`
          block h-px w-6 origin-center bg-gold-bright
          transition-transform duration-300 ease-[var(--ease-sys)]
          ${isOpen ? "translate-y-[4.5px] rotate-45" : ""}
        `}
      />

      <span
        className={`
          block h-px origin-center bg-gold-bright
          transition-all duration-200 ease-[var(--ease-sys)]
          ${isOpen ? "w-0 opacity-0" : "w-4 opacity-100"}
        `}
      />

      <span
        className={`
          block h-px w-6 origin-center bg-gold-bright
          transition-transform duration-300 ease-[var(--ease-sys)]
          ${isOpen ? "-translate-y-[4.5px] -rotate-45" : ""}
        `}
      />
    </button>
  );
}

export default NavHamburger;