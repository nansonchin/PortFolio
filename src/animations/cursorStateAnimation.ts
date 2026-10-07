import gsap from "gsap"


export type CursorStateAnimationProps={
    cursor:HTMLDivElement|null;
    glow:HTMLDivElement|null
}

export function createCursorStateAnimation({
    cursor,glow
}:CursorStateAnimationProps){
    if(!cursor || !glow){
        return
    }

    const setDefault = ()=>{
        gsap.to(
            cursor,
            {
                scale:1,
                duration:0.3,
                ease:"power3.out"
            }
        )

        gsap.to(glow,{
            scale:1,
            opacity:0.4,
            duration:0.3,
            ease:"power3.out"
        })
    }

    const setView=()=>{
        gsap.to(cursor,{
            scale:1.15,
            duration:0.35,
            ease:"back.out(1.7)"
        })

        gsap.to(glow,{
            scale:1.25,
            opacity:0.8,
            duration:0.35,
            ease:"power3.out"
        })
    }

    return{
        setDefault,
        setView
    }
}