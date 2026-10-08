import { useLayoutEffect, useRef } from "react";
import { projectHeroReveal } from "../../../../animations/projectHeroRevealAnimations";

function ProjectHeroFeatures(){
    const sectionRef = useRef<HTMLElement|null>(null)

    useLayoutEffect(()=>{
        const section = sectionRef.current;

        if(!section){
            return;
        }

        const ctx=projectHeroReveal({
            container:section
        })

        return()=>{
            ctx.revert()
        }
    },[])

    return(
        <section ref={sectionRef} className="min-h-screen flex items-center px-6 md:px-10 lg:px-16 bg-black text-white">
            <div className="hero-label text-yellow-400 uppercase tracking-[0.5rem] text-sm">
                <p className="hero-label text-yellow-400 uppercase tracking-[0.5rem] text-sm">Projects</p>
                <h1 className="hero-title mt-8 text-6xl md:text-8xl lg:text-[10rem] font-bold leading-none">Explore <br/> My Work</h1>
                <p className="hero-description mt-10 max-w-2xl text-neutral-400 text-lg md:text-xl leading-relaxed">A collection of frontend projects, experiment and engineering solutions built with React, TypeScript and modern web technologies</p>
            </div>
        </section>
    )
}

export default ProjectHeroFeatures