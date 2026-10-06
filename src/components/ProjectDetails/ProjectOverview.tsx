import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectDetailModel } from "../../models/ProjectDetailModel";
import { projectOverviewAnimation } from "../../animations/projectOverviewAnimation";


gsap.registerPlugin(ScrollTrigger);

type Props = {
  project: ProjectDetailModel;
};

function ProjectOverview({ project }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current
    if(!section){
      return
    }
    const ctx = projectOverviewAnimation({
      container:section
    })
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black px-8 md:px-16 py-32">
      <div className="max-w-7xl mx-auto">
        <div className="gold-line h-[2px] bg-yellow-400 mb-16 w-full" />

        <div className="grid md:grid-cols-2 gap-16">
          <div className="overview-item">
            <p className="text-yellow-400 uppercase tracking-[0.4em] text-sm">
              Project Overview
            </p>

            <h2 className="mt-8 text-5xl md:text-6xl font-bold text-white">
              {project.title}
            </h2>
          </div>

          <div className="overview-item">
            <p className="text-neutral-400 text-lg leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="overview-item">
            <p className="text-neutral-500 uppercase text-sm">Role</p>

            <p className="mt-3 text-white text-xl">Frontend Developer</p>
          </div>

          <div className="overview-item">
            <p className="text-neutral-500 uppercase text-sm">Year</p>

            <p className="mt-3 text-white text-xl">{project.year}</p>
          </div>

          <div className="overview-item">
            <p className="text-neutral-500 uppercase text-sm">Category</p>

            <p className="mt-3 text-white text-xl">{project.category}</p>
          </div>

          <div className="overview-item">
            <p className="text-neutral-500 uppercase text-sm">Status</p>
            <p className="mt-3 text-white text-xl">Completed</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverview;
