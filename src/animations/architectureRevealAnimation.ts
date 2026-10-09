
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function createArchitectureReveal(root: HTMLElement) {
  const context = gsap.context(() => {
    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-architecture-node]"),
    );

    const lines = Array.from(
      root.querySelectorAll<HTMLElement>("[data-architecture-line]"),
    );

    if (nodes.length === 0) {
      return;
    }

    const getDepth = (element: HTMLElement) =>
      Number(element.dataset.architectureDepth ?? 0);

    const maxDepth = Math.max(...nodes.map(getDepth));

    // Prepare nodes before the animation begins.
    gsap.set(nodes, {
      autoAlpha: 0,
      y: 24,
      scale: 0.98,
      transformOrigin: "50% 50%",
    });

    // Prepare horizontal and vertical connector lines.
    lines.forEach((line) => {
      const direction = line.dataset.architectureLine;

      gsap.set(line, {
        autoAlpha: 0,
        scaleX: direction === "horizontal" ? 0 : 1,
        scaleY: direction === "vertical" ? 0 : 1,
        transformOrigin:
          direction === "horizontal" ? "50% 50%" : "50% 0%",
      });
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 75%",
        once: true,
      },
    });

    // Reveal the root node first.
    const rootNodes = nodes.filter((node) => getDepth(node) === 0);

    timeline.to(rootNodes, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.12,
    });

    // Reveal each layer's connectors, then its nodes.
    for (let depth = 1; depth <= maxDepth; depth += 1) {
      const linesAtDepth = lines.filter(
        (line) => getDepth(line) === depth,
      );

      const verticalLines = linesAtDepth.filter(
        (line) => line.dataset.architectureLine === "vertical",
      );

      const horizontalLines = linesAtDepth.filter(
        (line) => line.dataset.architectureLine === "horizontal",
      );

      const nodesAtDepth = nodes.filter(
        (node) => getDepth(node) === depth,
      );

      if (verticalLines.length > 0) {
        timeline.to(
          verticalLines,
          {
            autoAlpha: 1,
            scaleY: 1,
            duration: 0.3,
            ease: "power2.out",
            stagger: 0.04,
          },
          ">-0.05",
        );
      }

      if (horizontalLines.length > 0) {
        timeline.to(
          horizontalLines,
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.04,
          },
          "<",
        );
      }

      if (nodesAtDepth.length > 0) {
        timeline.to(
          nodesAtDepth,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.1,
          },
          ">-0.05",
        );
      }
    }
  }, root);

  // Clean up GSAP animations and ScrollTriggers when unmounted.
  return () => context.revert();
}