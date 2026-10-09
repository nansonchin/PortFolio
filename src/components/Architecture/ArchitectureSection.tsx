import type { ProjectArchitectureModel } from "../../models/ProjectArchitectureModel"
import ArchitectureTree from "./ArchitectureTree"

type ArchitectureSectionProps={
    architecture: ProjectArchitectureModel
}

function ArchitectureSection({
    architecture
}:ArchitectureSectionProps){
    return(
        <section className="min-h-screen bg-black px-8 py-32">
            <div className="max-w-7xl mx-auto">
                <p className="uppercase tracking-[0.3rem] text-yellow-400 text-sm">Architecture</p>
                <h2 className="mt-6 text-5xl font-bold text-white">{architecture.title}</h2>
                <p className="mt-6 max-w-2xl text-neutral-400">{architecture.description}</p>
                <div className="mt-24 overflow-x-auto">
                    <ArchitectureTree architecture={architecture}/>
                </div>
            </div>
        </section>
    )
}

export default ArchitectureSection