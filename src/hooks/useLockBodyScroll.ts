import { useEffect } from "react";
import { useLenis } from "lenis/react";

export function useLockBodyScroll(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    lenis?.stop(); 

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
    };
  }, [locked, lenis]);
}