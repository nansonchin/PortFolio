import { useEffect } from "react";

type UseLightboxKeyboardProps = {
  isOpen: boolean;

  onClose: () => void;

  onNext: () => void;

  onPrevious: () => void;
};

export function useLightboxKeyboard({
  isOpen,

  onClose,

  onNext,

  onPrevious,
}: UseLightboxKeyboardProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      switch (event.key) {
        case "Escape":
          onClose();

          break;

        case "ArrowRight":
          onNext();

          break;

        case "ArrowLeft":
          onPrevious();

          break;

        default:
          break;
      }
    }

    window.addEventListener(
      "keydown",

      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",

        handleKeyDown,
      );
    };
  }, [isOpen, onClose, onNext, onPrevious]);
}
