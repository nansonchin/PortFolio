import ProjectCard from "../../../../components/FeaturedProjects/ProjectCard"
import type { ProjectCardModel } from "../../../../models/ProjectCardModel"

type ProjectGridProps={
    projects:ProjectCardModel[]
}

function ProjectGrid({
    projects
}:ProjectGridProps){
    return(
        <div className="grid md:grid-cols-2 gap-8">
            {
                projects.map(project=>(
                    <ProjectCard key={project.id} project={project}/>
                ))
            }
        </div>
    )
}

export default ProjectGrid;