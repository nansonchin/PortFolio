import gsap from "gsap";

export function createCursorMovement(cursor: HTMLDivElement) {
  const xTo = gsap.quickTo(cursor, "x", {
    duration: 0.3,
    ease: "power3.out",
  });

  const yTo = gsap.quickTo(cursor, "y", {
    duration: 0.3,
    ease: "power3.out",
  });

  return {
    move(x: number, y: number) {
      xTo(x);
      yTo(y);
    },
  };
}
