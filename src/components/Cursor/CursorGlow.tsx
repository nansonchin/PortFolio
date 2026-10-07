import { forwardRef } from "react";

type CursorGlowProps={
    className?:string;
}

const CursorGlow = forwardRef<HTMLDivElement,CursorGlowProps>(
    ({
        className
    },ref)=>{
        return(
            <div ref={ref} className={className} aria-hidden="true">

            </div>
        )
    }
)

export default CursorGlow