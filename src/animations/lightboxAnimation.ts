import gsap from "gsap";

type LightboxAnimationProps = {
  container: HTMLElement;
};

export function lightboxOpenAnimation({ container }: LightboxAnimationProps) {
  const image = container.querySelector(".lightbox-image");

  const content = container.querySelector(".lightbox-content");

  const timeline = gsap.timeline();

  timeline.fromTo(
    container,

    {
      opacity: 0,
    },

    {
      opacity: 1,

      duration: 0.45,

      ease: "power2.out",
    },
  );

  timeline.fromTo(
    image,

    {
      scale: 0.85,

      opacity: 0,

      y: 30,
    },

    {
      scale: 1,

      opacity: 1,

      y: 0,

      duration: 0.7,

      ease: "power3.out",
    },

    "-=0.25",
  );

  timeline.fromTo(
    content,

    {
      opacity: 0,

      y: 40,
    },

    {
      opacity: 1,

      y: 0,

      duration: 0.5,

      ease: "power3.out",
    },

    "-=0.35",
  );

  return timeline;
}

export function lightboxCloseAnimation({ container }: LightboxAnimationProps) {
  const timeline = gsap.timeline();

  timeline.to(
    container,

    {
      opacity: 0,

      duration: 0.35,

      ease: "power2.in",
    },
  );

  return timeline;
}
