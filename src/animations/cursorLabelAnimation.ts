import gsap from "gsap";

type CursorLabelAnimationProps = {
  element: HTMLDivElement;
};

export function createCursorLabelAnimation({
  element,
}: CursorLabelAnimationProps) {
  const show = () => {
    gsap.to(element, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: 0.35,
      ease: "back.out(1.7)",
      overwrite: "auto",
    });
  };

  const hide = () => {
    gsap.to(element, {
      opacity: 0,
      scale: 0.8,
      filter: "blur(8px)",
      duration: 0.25,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  return {
    show,
    hide,
  };
}
