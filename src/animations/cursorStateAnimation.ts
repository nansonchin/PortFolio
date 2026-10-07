import gsap from "gsap";

export type CursorStateAnimationProps = {
  cursor: HTMLDivElement | null;
  glow: HTMLDivElement | null;
};

export type CursorStateMode =
  | "default"
  | "view"
  | "code"
  | "live";

export function createCursorStateAnimation({
  cursor,
  glow,
}: CursorStateAnimationProps) {
  if (!cursor || !glow) {
    return;
  }

  const setDefault = () => {
    gsap.to(cursor, {
      scale: 1,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(glow, {
      scale: 1,
      opacity: 0.4,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const setView = () => {
    gsap.to(cursor, {
      scale: 1.25,
      duration: 0.35,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });

    gsap.to(glow, {
      scale: 1.5,
      opacity: 0.8,
      duration: 0.35,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const setCode = () => {
    gsap.to(cursor, {
      scale: 1.18,
      duration: 0.3,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });

    gsap.to(glow, {
      scale: 1.4,
      opacity: 0.7,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const setLive = () => {
    gsap.to(cursor, {
      scale: 1.15,
      duration: 0.3,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });

    gsap.to(glow, {
      scale: 1.35,
      opacity: 0.65,
      duration: 0.3,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return {
    setDefault,
    setView,
    setCode,
    setLive,
  };
}