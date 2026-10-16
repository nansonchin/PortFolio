import GlitchText from "../../../../components/GlitchText/GlitchText";
import SectionLabel from "../../../../components/SectionLabel/SectionLabel";

function ProjectHeroFeatures() {
  return (
    <section className="px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <div data-reveal>
          <SectionLabel index="05" text="PROJECTS" className="mb-10" />
        </div>

        <h1
          data-reveal
          className="font-display text-[clamp(3rem,10vw,9.5rem)] uppercase leading-[0.9] text-paper"
        >
          <span className="block">Explore</span>
          <span className="block italic text-gold-bright"><GlitchText text="my work." loop /></span>
        </h1>

        <p data-reveal className="text-body mt-10 max-w-2xl">
          A collection of frontend projects, experiments and engineering solutions built with React,
          TypeScript and modern web technologies.
        </p>
      </div>
    </section>
  );
}

export default ProjectHeroFeatures;