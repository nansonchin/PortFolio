import { forwardRef } from "react";


type CursorSvgProps = {
    className?: string;
};


const CursorSvg = forwardRef<SVGSVGElement, CursorSvgProps>(
    (
        {
            className
        },
        ref
    ) => {

        return (
            <svg
                ref={ref}
                className={className}
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >

                {/* 
                    Outer Ring
                    Large scanning boundary
                */}
                <circle
                    cx="40"
                    cy="40"
                    r="37"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="1.25"
                    className="cursor-outer-ring"
                />


                {/*
                    Middle Ring
                    Stronger HUD frame
                */}
                <circle
                    cx="40"
                    cy="40"
                    r="33"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="cursor-middle-ring"
                />



                {/*
                    Inner HUD Dash Arc
                */}

                {/* Top Left */}
                <path
                    d="
                    M40 12
                    A28 28 0 0 0 12 40
                    "
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="0 10"
                    className="cursor-arc cursor-arc-1"
                />


                {/* Top Right */}
                <path
                    d="
                    M40 12
                    A28 28 0 0 1 68 40
                    "
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="12 10"
                    className="cursor-arc cursor-arc-2"
                />


                {/* Bottom Right */}
                <path
                    d="
                    M68 40
                    A28 28 0 0 1 40 68
                    "
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="0 10"
                    className="cursor-arc cursor-arc-3"
                />


                {/* Bottom Left */}
                <path
                    d="
                    M40 68
                    A28 28 0 0 1 12 40
                    "
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="12 10"
                    className="cursor-arc cursor-arc-4"
                />



                {/*
                    Inner Target Ring
                */}
                <circle
                    cx="40"
                    cy="40"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.35"
                    className="cursor-target"
                />



                {/*
                    Center Lock Point
                */}
                <circle
                    cx="40"
                    cy="40"
                    r="4"
                    fill="currentColor"
                    className="cursor-core"
                />

            </svg>
        );

    }
);


CursorSvg.displayName = "CursorSvg";


export default CursorSvg;