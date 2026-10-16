export type LightboxBackdropProps = {
  children: React.ReactNode;
  onClose: () => void;
};

function LightboxBackdrop({ children, onClose }: LightboxBackdropProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-6 md:p-8"
      onClick={onClose}
    >
      <p className="label absolute right-6 top-5 text-gold-dim">ESC TO CLOSE</p>

      <div
        className="relative w-full max-w-7xl"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default LightboxBackdrop;