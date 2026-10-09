
import { useEffect, useRef } from "react";
import type { ProjectArchitectureModel } from "../../models/ProjectArchitectureModel";
import ArchitectureTree from "./ArchitectureTree";
import { createArchitectureReveal } from "../../animations/architectureRevealAnimation";

type ArchitectureSectionProps = {
  architecture: ProjectArchitectureModel;
};

function ArchitectureSection({
  architecture,
}: ArchitectureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    return createArchitectureReveal(section);
  }, [architecture]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080706] px-6 py-28 md:px-10 md:py-36"
    >
      {/* Subtle background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            System Architecture
          </p>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            {architecture.title}
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-400 md:text-base">
            {architecture.description}
          </p>
        </div>

        <div className="mt-20 min-w-0 rounded-2xl border border-white/[0.06] bg-white/[0.015] py-14 md:mt-28 md:py-20">
          <ArchitectureTree architecture={architecture} />
        </div>

        <p className="mt-5 text-right text-[10px] uppercase tracking-[0.2em] text-neutral-600">
          Explore the system structure
        </p>
      </div>
    </section>
  );
}

export default ArchitectureSection;