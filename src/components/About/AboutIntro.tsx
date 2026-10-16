import { developerContext } from "../../data/developerContext";
import { profile } from "../../data/profile";
import GlitchText from "../GlitchText/GlitchText";
import SectionLabel from "../SectionLabel/SectionLabel";

type ReadoutRow ={
    label:string;
    value:string
}

function AboutIntro(){
    const rows:ReadoutRow[]=[
        {
            label:"NAME", value:developerContext.name.toUpperCase()
        },
        {
            label:"ROLE",value:developerContext.role.toUpperCase()
        },
        ...profile.location?[{label:"LOCATION",value:profile.location.toUpperCase()}] :
        [{label:"LOCATION",value:"[ --ERROR-- ]"}],
        {label:"FOCUS",value:profile.focus.join(" / ").toUpperCase()},
    ]

    return (
    <section className="px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <div data-reveal>
          <SectionLabel index="02" text="ABOUT" className="mb-10" />
        </div>

        <h1
          data-reveal
          className="font-display text-[clamp(2.75rem,8vw,7.5rem)] uppercase leading-[0.92] text-paper"
        >
          {profile.headline.map((line) => (
            <span key={line} className="block">
              <GlitchText text={line} loop /> 
            </span>
          ))}
        </h1>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <div className="space-y-6">
            {profile.intro.map((paragraph) => (
              <p key={paragraph} data-reveal className="text-body">
                {paragraph}
              </p>
            ))}
          </div>

          <dl data-reveal className="border-t border-line">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4"
              >
                <dt className="label text-gold-dim">{row.label}</dt>
                <dd className="font-system text-sm tracking-wide text-paper">{row.value}</dd>
              </div>
            ))}

            <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-line py-4">
              <dt className="label text-gold-dim">STATUS</dt>
              <dd className="flex items-center gap-3 font-system text-sm tracking-wide text-gold-bright">
                <span className="blink h-2 w-2 bg-gold-bright" />
                {profile.status.toUpperCase()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default AboutIntro;