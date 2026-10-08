import type { ProjectStat } from "../../../../models/ProjectStatsModel";

type ProjectStatsProps={
    stats:ProjectStat[]
}
function ProjectStats({stats}:ProjectStatsProps) {
  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 bg-black text-white">
      <div className="max-w-[1600px] mx-auto grid md:grid-cols-3 gap-12">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-item">
            <h3 className="text-6xl md:text-8xl font-bold">
                {stat.value}
            </h3>
            <p className="mt-4 uppercase tracking-[0.3rem] text-sm text-neutral-400">
                {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectStats
