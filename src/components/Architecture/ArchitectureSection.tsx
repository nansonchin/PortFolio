import { useEffect, useRef } from "react";
import type { ProjectArchitectureModel } from "../../models/ProjectArchitectureModel";
import ArchitectureTree from "./ArchitectureTree";
import { createArchitectureReveal } from "../../animations/architectureRevealAnimation";
import SectionLabel from "../SectionLabel/SectionLabel";

type ArchitectureSectionProps = {
  index: string;
  architecture: ProjectArchitectureModel;
};

function ArchitectureSection({ index, architecture }: ArchitectureSectionProps) {
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
      className="relative overflow-hidden border-t border-line bg-ink-2 px-6 py-20 md:px-10 md:py-28"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <SectionLabel index={index} text="ARCHITECTURE" className="mb-8" />
          <h2 className="heading-lg text-paper">{architecture.title}</h2>
          <p className="text-body mt-6 max-w-2xl">{architecture.description}</p>
        </div>

        <div className="mt-16 min-w-0 border border-line bg-ink py-12 md:mt-20 md:py-16">
          <ArchitectureTree architecture={architecture} />
        </div>

        <p className="label mt-4 text-right text-gold-dim">Select a node to explore</p>
      </div>
    </section>
  );
}

export default ArchitectureSection;