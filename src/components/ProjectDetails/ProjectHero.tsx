import type { ProjectDetailModel } from "../../models/ProjectDetailModel";

type ProjectHeroProps ={
    project:ProjectDetailModel;
}

function ProjectHero ({
    project,
}:ProjectHeroProps){
    return(
        <section className="min-h-screen flex items-center px-8 md:px-16">
            <div>
                <p className="uppercase tracking-[0.4rem] text-yellow-400">{project.category}</p>
                <h1 className="mt-4 text-7xl font-bold text-white">{project.title}</h1>
                <p className="mt-8 max-w-2xl text-neutral-400">{project.description}</p>
            </div>
        </section>
    )
}

export default ProjectHero