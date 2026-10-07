import { forwardRef } from "react";

type CursorMode = "default" | "view" | "code" | "live";

type CursorSvgProps = {
  className?: string;
  mode?: CursorMode;
};

const CursorSvg = forwardRef<SVGSVGElement, CursorSvgProps>(
  (
    {
      className,
      mode = "default",
    },
    ref
  ) => {
    const isCode = mode === "code";
    const isLive = mode === "live";
    const isDefault = !isCode && !isLive;

    return (
      <svg
        ref={ref}
        className={className}
        width="100%"
        height="100%"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isDefault && (
          <>
            {/* Outer Ring */}
            <circle
              cx="40"
              cy="40"
              r="37"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.25"
              className="cursor-outer-ring"
            />

            {/* Middle Ring */}
            <circle
              cx="40"
              cy="40"
              r="33"
              stroke="currentColor"
              strokeWidth="2.5"
              opacity="0.5"
              className="cursor-middle-ring"
            />

            {/* Inner HUD Dash Arc - Top Left */}
            <path
              d="M40 12 A28 28 0 0 0 12 40"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 10"
              className="cursor-arc cursor-arc-1"
            />

            {/* Top Right */}
            <path
              d="M40 12 A28 28 0 0 1 68 40"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="12 10"
              className="cursor-arc cursor-arc-2"
            />

            {/* Bottom Right */}
            <path
              d="M68 40 A28 28 0 0 1 40 68"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="2 10"
              className="cursor-arc cursor-arc-3"
            />

            {/* Bottom Left */}
            <path
              d="M40 68 A28 28 0 0 1 12 40"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="12 10"
              className="cursor-arc cursor-arc-4"
            />
   <circle
              cx="40"
              cy="40"
              r="20"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.5"
              className="cursor-middle-ring"
            />
            
            {/* Inner Target Ring */}
            <circle
              cx="40"
              cy="40"
              r="10"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.35"
              className="cursor-target"
            />

            {/* Center Dot */}
            <circle
              cx="40"
              cy="40"
              r="4"
              fill="currentColor"
              className="cursor-core"
            />
          </>
        )}

        {isCode && (
          <>
            {/* Outer Square */}
            <rect
              x="14"
              y="14"
              width="52"
              height="52"
              rx="8"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.8"
              className="cursor-code-outer"
            />

            {/* Inner Square */}
            <rect
              x="28"
              y="28"
              width="24"
              height="24"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.45"
              className="cursor-code-inner"
            />

            {/* Center Dot */}
            <circle
              cx="40"
              cy="40"
              r="3.5"
              fill="currentColor"
              className="cursor-core"
            />
          </>
        )}

        {isLive && (
          <>
            {/* Outer Triangle */}
            <path
              d="M40 12 L68 64 L12 64 Z"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinejoin="round"
              opacity="0.9"
              className="cursor-live-outer"
            />

            {/* Inner Triangle */}
            <path
              d="M40 24 L56 54 L24 54 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              opacity="0.45"
              className="cursor-live-inner"
            />

            {/* Center Dot */}
            <circle
              cx="40"
              cy="40"
              r="3.5"
              fill="currentColor"
              className="cursor-core"
            />
          </>
        )}
      </svg>
    );
  }
);

CursorSvg.displayName = "CursorSvg";

export default CursorSvg;