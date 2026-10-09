import { useLayoutEffect, useRef } from "react";
import { projectStoryReveal } from "../../animations/projectStoryReveal";
import type { ProjectStoryModel } from "../../models/ProjectStoryModel";

type ProjectStoryProps = {
  story: ProjectStoryModel;
};

function ProjectStory({ story }: ProjectStoryProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const ctx = projectStoryReveal({
      container: section,
    });

    return () => {
      ctx.revert();
    };
  }, []);
  return (
    <section ref={sectionRef} className="bg-black px-8 md:px-16 py-32">
      <div className="max-w-6xl mx-auto">
        <p className="text-yellow-400 uppercase tracking-[0.3rem] text-sm">
          Case Study
        </p>
        <h2 className="mt-6 text-5xl md:text-7xl font-bold text-white">
          Behind The Project
        </h2>
        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <article className="story-item">
            <h3 className="text-2xl font-semibold text-white">Problem</h3>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              {story.problem}
            </p>
          </article>
          <article className="story-item">
            <h3 className="text-2xl font-semibold text-white">Approach</h3>
            <p className="mt-4 text-neutral-400 leading-relaxed">
              {story.approach}
            </p>
          </article>
        </div>
        <div className="mt-16 story-item">
          <h3 className="text-2xl font-semibold text-white">Architecture</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {story.architecture.map((item) => (
              <span className="px-4 py-2 rounded-full bg-white/10 text-neutral-300 text-sm">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-16 story-item">
          <h3 className="text-2xl font-semibold text-white">Outcome</h3>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            {story.outcome}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProjectStory;
