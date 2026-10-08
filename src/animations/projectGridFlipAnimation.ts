import gsap from "gsap";
import { Flip } from "gsap/Flip";


gsap.registerPlugin(Flip);



export function projectGridFlipAnimation(
    state:Flip.FlipState
){


    return Flip.from(
        state,
        {
            duration:1.2,
            ease:"power3.inOut",
            stagger:0.1,
            absolute:true,
            scale:true,
        }
    );

}