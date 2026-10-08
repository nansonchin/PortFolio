import gsap from "gsap"

type ProjectHeroRevealProps ={
    container:HTMLElement;
}

export function projectHeroReveal({
    container
}:ProjectHeroRevealProps){
    const ctx= gsap.context(()=>{
        const tl = gsap.timeline()

        tl.from(
            ".hero-label",
            {
                y:40,
                opacity:0,
                duration:0.8,
                ease:"power3.out"
            }
        )

        .from(".hero-title",{
            y:80,
            opacity:0,
            duration:1,
            ease:"power4.out"
        },
            "-=0.4"
        )

        .from(".hero-description",{
            y:40,
            opacity:0,
            duration:0.8,
            ease:"power3.out"
        },
            "-=0.5"
        )
    },container)

    return ctx;
}