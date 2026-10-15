export function prefersReducedMotion():boolean{
    return(
        typeof window!=="undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
}

export function glitchBurst(
    element:HTMLElement | null | undefined,
    duration = 320,
):()=>void{
    if(!element || prefersReducedMotion())return () =>{};

    delete element.dataset.glitch;
    void element.offsetWidth;
    element.dataset.glitch = "on"

    const timer = window.setTimeout(()=>{
        delete element.dataset.glitch
    },duration)

    return ()=>{
        window.clearTimeout(timer)
        delete element.dataset.glitch
    }
}

export function setGlitchText(
    element:HTMLElement| null | undefined,
    text:string
){
    if(!element) return;

    element.textContent=text;
    element.dataset.text=text
}