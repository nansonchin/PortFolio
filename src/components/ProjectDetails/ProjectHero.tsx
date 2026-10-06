import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import { projectHeroAnimation } from "../../animations/projectHeroAnimation";


gsap.registerPlugin(ScrollTrigger);

type Props = {
  project: ProjectDetailModel;
};

function ProjectHero({ project }: Props) {
  const containerRef = useRef<HTMLElement | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const glowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if(!containerRef.current || !titleRef.current || !imageRef.current || !glowRef.current){
      return;
    }

    const ctx = projectHeroAnimation({
      containerRef:containerRef.current,
      titleRef:titleRef.current,
      imageRef:imageRef.current,
      glowRef:glowRef.current
    })
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-black px-8 md:px-16 flex items-center"
    >
      <div
        ref={glowRef}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-yellow-400/50 blur-[120px] z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <p className="project-category uppercase tracking-[0.5em] text-yellow-400 text-sm">
          {project.category}
        </p>

        <h1
          ref={titleRef}
          className="mt-8 text-6xl md:text-8xl font-bold text-white leading-none"
        >
          {project.title}
        </h1>

        <p className="project-description mt-8 max-w-2xl text-neutral-400 text-lg leading-relaxed">
          {project.description}
        </p>

        <div className="project-actions mt-10 flex gap-5">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-yellow-400 text-black rounded-full font-medium"
            >
              Live Demo
            </a>
          )}

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/20 text-white rounded-full"
          >
            Github
          </a>
        </div>

        <div className="mt-20 overflow-hidden rounded-3xl">
          <img
            ref={imageRef}
            src={project.heroImage}
            alt={project.title}
            className="w-full h-[500px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default ProjectHero;
