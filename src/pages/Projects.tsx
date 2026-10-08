import ProjectHeroFeatures from "../features/projects/components/ProjectHero/ProjectHero"
import ProjectStats from "../features/projects/components/ProjectStats/ProjectStats"
import ProjectExplorer from "../features/projects/components/ProjectExplorer/ProjectExplorer"
import { projectRepository } from "../repository/ProjectRepository"

function  Projects(){
    const stats = projectRepository.getStats()
    return(
        <main className="bg-black min-h-screen">
            <ProjectHeroFeatures/>
            <ProjectStats stats={stats}/>
            <ProjectExplorer/>
        </main>
    )
}

export default Projects