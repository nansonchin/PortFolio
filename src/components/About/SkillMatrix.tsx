import { profile } from "../../data/profile";
import SectionLabel from "../SectionLabel/SectionLabel";

const pad = (value: number) => String(value).padStart(2, "0");

function SkillMatrix() {
  return (
    <section className="border-t border-line px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div data-reveal className="mb-12 md:mb-16">
          <SectionLabel index="02.1" text="SKILLS" className="mb-8" />
          <h2 className="heading-lg text-paper">What I work with</h2>
        </div>

        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {profile.skillGroups.map((group, groupIndex) => (
            <div key={group.title} data-reveal className="bg-ink p-6 md:p-8">
              <p className="label mb-6 text-gold">
                [ {pad(groupIndex + 1)} ] {group.title}
              </p>

              <ul className="-mx-3">
                {group.items.map((item) => (
                  <li key={item} className="bar-select px-3 py-2 font-system text-sm tracking-wide">
                    <span className="mr-2 opacity-60">&gt;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillMatrix;