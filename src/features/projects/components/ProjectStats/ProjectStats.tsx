import type { ProjectStat } from "../../../../models/ProjectStatsModel";

type ProjectStatsProps = {
  stats: ProjectStat[];
};

function ProjectStats({ stats }: ProjectStatsProps) {
  return (
    <section className="px-6 pb-20 md:px-10 md:pb-28">
      <dl
        data-reveal
        className="mx-auto grid max-w-7xl grid-cols-1 border-l border-t border-line sm:grid-cols-3"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="border-b border-r border-line p-6 md:p-8">
            <dt className="label mb-4 text-gold-dim">{stat.label}</dt>
            <dd className="font-display text-6xl leading-none text-gold md:text-7xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default ProjectStats;