import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import { projectTechAnimation } from "../../animations/projectTechAnimation";


gsap.registerPlugin(ScrollTrigger);

type Props = {
  project: ProjectDetailModel;
};

function ProjectTechStack({ project }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current
    if(!section){
      return
    }
    const ctx = projectTechAnimation({
      container:section
    })
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black px-8 md:px-16 py-32">
      <div className="max-w-7xl mx-auto">
        <p className="text-yellow-400 uppercase tracking-[0.5em] text-sm">
          Technology
        </p>

        <h2 className="mt-8 text-5xl md:text-7xl font-bold text-white">
          Built With
        </h2>

        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {project.technologies.map((tech, index) => (
            <div
              key={tech}
              className="tech-item group relative border border-white/10 rounded-3xl p-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/40 transition duration-500" />

              <div className="relative z-10">
                <span className="text-neutral-500 text-sm">{String(index+1).padStart(2,"0")}</span>

                <h3 className="mt-6 text-3xl font-semibold text-white group-hover:text-yellow-400 transition">
                  {tech}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectTechStack;
