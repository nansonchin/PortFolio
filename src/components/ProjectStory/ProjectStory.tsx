import type { ProjectStoryModel } from "../../models/ProjectStoryModel";
import SectionLabel from "../SectionLabel/SectionLabel";

type ProjectStoryProps = {
  index: string;
  story: ProjectStoryModel;
  challenges: string[];
  solutions: string[];
};

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectStory({
  index,
  story,
  challenges,
  solutions,
}: ProjectStoryProps) {
  const blocks = [
    { tag: "PROBLEM", text: story.problem },
    { tag: "APPROACH", text: story.approach },
    { tag: "OUTCOME", text: story.outcome },
  ].filter((block) => block.text);

  const stack = story.architecture ?? [];

  const log = challenges.map((challenge, i) => ({
    challenge,
    solution: solutions[i],
  }));

  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 md:mb-16">
          <SectionLabel index={index} text="CASE STUDY" className="mb-8" />
          <h2 className="heading-lg text-paper">Behind the project</h2>
        </div>

        {blocks.length > 0 && (
          <div className="border-t border-line">
            {blocks.map((block, i) => (
              <div
                key={block.tag}
                data-reveal
                className="grid gap-4 border-b border-line py-8 md:grid-cols-[14rem_1fr] md:gap-10"
              >
                <p className="label text-gold">
                  [ {pad(i + 1)} ] {block.tag}
                </p>
                <p className="text-body max-w-3xl">{block.text}</p>
              </div>
            ))}
          </div>
        )}

        {stack.length > 0 && (
          <div data-reveal className="mt-12 flex flex-wrap gap-3">
            {stack.map((item) => (
              <span
                key={item}
                className="label border border-line px-4 py-2 text-paper"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {log.length > 0 && (
          <div className={blocks.length > 0 ? "mt-20" : ""}>
            <p data-reveal className="label mb-6 text-gold">
              [ LOG ] CHALLENGES &amp; SOLUTIONS
            </p>

            <div className="border-t border-line">
              {log.map((row, i) => (
                <div
                  key={`${i}-${row.challenge}`}
                  data-reveal
                  className="grid gap-4 border-b border-line py-8 md:grid-cols-[4rem_1fr_1fr] md:gap-10"
                >
                  <span className="label text-gold-dim">{pad(i + 1)}</span>

                  <div>
                    <p className="label mb-2 text-gold-dim">CHALLENGE</p>
                    <p className="text-body">{row.challenge}</p>
                  </div>

                  <div>
                    <p className="label mb-2 text-gold">SOLUTION</p>
                    <p className="text-body">{row.solution ?? "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProjectStory;
