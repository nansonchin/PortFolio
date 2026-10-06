export type LightboxBackdropProps = {
  children: React.ReactNode;

  onClose: () => void;
};

function LightboxBackdrop({
  children,

  onClose,
}: LightboxBackdropProps) {
  return (
    <div
      className="
            fixed
            inset-0
            z-50
            bg-black/95
            flex
            items-center
            justify-center
            p-8
            "
      onClick={onClose}
    >
      <div
        className="
                relative

                w-full

                max-w-7xl
                "
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
