import { useLayoutEffect, useRef } from "react";
import { getProjects } from "../../domain/projects/project.data";
import ProjectCard from "./ProjectCard";
import { projectCardsReveal } from "../../animations/projectAnimation";

function FeaturedProjects(){
    const sectionRef = useRef<HTMLElement | null>(null)
    const projects = getProjects().filter((project)=>project.featured)

    useLayoutEffect(()=>{
        const section = sectionRef.current

        if(!section){
            return
        }

        const ctx = projectCardsReveal(section)

        return ()=>{
            ctx.revert()
        }
    },[])
    return(
        <section ref={sectionRef} className="min-h-screen px-6 md:px-10 lg:px-16 py-32">
            <div className="max-w-[1600px] mx-auto">
                <div className="max-w-[1600px] mx-auto">
                    <div className="mb-16">
                        <p className="text-yellow-400 uppercase tracking-[0.3rem] text-sm">Selected Work</p>
                        <h2 className="mt-4 text-5xl md:text-7xl font-bold text-white">Featured Projects</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {
                            projects.map((project)=>(
                                <ProjectCard key={project.id} project={project}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
export default FeaturedProjects