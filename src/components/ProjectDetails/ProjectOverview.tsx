import type { ProjectDetailModel } from "../../models/ProjectDetailModel";

type ProjectOverviewProps={
  project:ProjectDetailModel;
}

function ProjectOverview({
    project,
}:ProjectOverviewProps){
    return(
        <section className="px-8 md:px-16 py-24">
            <h2 className="text-4xl font-semibold text-white">Overview</h2>
            <p className="mt-8 max-w-3xl text-neutral-400 leading-8">{project.description}</p>
        </section>
    )
}

export default ProjectOverview