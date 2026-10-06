import gsap from "gsap";

type Props = {
  element: HTMLElement;
};

export function lightboxImageOut({ element }: Props) {
  return gsap.to(
    element,

    {
      opacity: 0,

      scale: 0.96,

      duration: 0.25,

      ease: "power2.in",
    },
  );
}

export function lightboxImageIn({ element }: Props) {
  return gsap.fromTo(
    element,

    {
      opacity: 0,

      scale: 1.04,
    },

    {
      opacity: 1,

      scale: 1,

      duration: 0.45,

      ease: "power3.out",
    },
  );
}
