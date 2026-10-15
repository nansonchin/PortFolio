import gsap from "gsap";

export function heroReveal() {
  const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

  timeline
    .from(".hero-eyebrow", { y: 16, autoAlpha: 0, duration: 0.7 })
    .from(".hero-line-inner", { yPercent: 115, duration: 1.1, stagger: 0.12 }, "-=0.3")
    .from(".hero-description", { y: 30, opacity: 0, duration: 0.9 }, "-=0.6")
    .from(".hero-actions > *", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.6")
    .from(".hero-marquee", { opacity: 0, duration: 1 }, "-=0.5");

  gsap.fromTo(
    ".scroll-line",
    { scaleX: 0.2, opacity: 0.4 },
    { scaleX: 1, opacity: 1, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" },
  );

  return timeline;
}