import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export function projectGridFlipAnimation(state: Flip.FlipState) {
  return Flip.from(state, {
    duration: 0.8,
    ease: "power3.inOut",
    stagger: 0.04,
    absolute: true,
    scale: true,
    onEnter: (elements) =>
      gsap.fromTo(
        elements,
        { autoAlpha: 0, scale: 0.92 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.25,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "opacity.visibility.transform",
        },
      ),
  });
}
