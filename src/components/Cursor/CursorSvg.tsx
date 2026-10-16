import { forwardRef } from "react";
import type { CursorMode } from "./cursorVisualConfig";

type CursorSvgProps = {
  className?: string;
  mode?: CursorMode;
};

/**
 * default / code / live 共用同一个版式：
 * 角括号 + 准星短线 + 虚线菱形 + 中心点。
 * code = 四个角 45° 倒角，live = 只保留 3 个角（三角形）。
 * 点击点永远是 (40, 40)。
 * .cursor-target-* / .cursor-core / .cursor-click-ring 被 GSAP 使用，不要改名。
 */
const CursorSvg = forwardRef<SVGSVGElement, CursorSvgProps>(
  ({ className, mode = "default" }, ref) => {
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
        {/* ───────── DEFAULT：四个直角 ───────── */}
        {mode === "default" && (
          <g className="cursor-target-default">
            <path
              d="M24 30V24H30 M50 24H56V30 M56 50V56H50 M30 56H24V50"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M40 28V32 M40 48V52 M28 40H32 M48 40H52"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-spin"
              d="M40 31L49 40L40 49L31 40Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-core"
              d="M40 36.5L43.5 40L40 43.5L36.5 40Z"
              fill="currentColor"
            />
          </g>
        )}

        {/* ───────── VIEW：更大的开放框 + 延长的准星线 ───────── */}
        {mode === "view" && (
          <g className="cursor-target-view">
            <path
              d="M18 26V18H26 M54 18H62V26 M62 54V62H54 M26 62H18V54"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M10 40H16 M64 40H70 M40 10V16 M40 64V70"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-spin"
              d="M40 28L52 40L40 52L28 40Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="5 4"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-core"
              d="M40 36.5L43.5 40L40 43.5L36.5 40Z"
              fill="currentColor"
            />
          </g>
        )}

        {/* ───────── CODE：同版式，外框整体旋转 45° = 钻石 ◇ ───────── */}
        {mode === "code" && (
          <g className="cursor-target-code">
            {/* default 的四个直角括号，绕点击点 (40,40) 旋转 45° */}
            <path
              transform="rotate(45 40 40)"
              d="M24 30V24H30 M50 24H56V30 M56 50V56H50 M30 56H24V50"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M40 28V32 M40 48V52 M28 40H32 M48 40H52"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-spin"
              d="M40 31L49 40L40 49L31 40Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-core"
              d="M40 36.5L43.5 40L40 43.5L36.5 40Z"
              fill="currentColor"
            />
          </g>
        )}
        {/* ───────── LIVE：同版式，三个角组成三角形 ───────── */}
        {mode === "live" && (
          <g className="cursor-target-live">
            {/* 三角形顶点 (40,14) (62,53) (18,53)，重心正好是 (40,40) */}
            <path
              d="M35.6 21.8L40 14L44.4 21.8 M57.6 45.2L62 53H53 M22.4 45.2L18 53H27"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            {/* 三条准星短线，分别指向三个角 */}
            <path
              d="M40 30V26 M48.6 45.1L52 47.1 M31.4 45.1L28 47.1"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.6"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-spin"
              d="M40 31L49 40L40 49L31 40Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.55"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="cursor-core"
              d="M40 36.5L43.5 40L40 43.5L36.5 40Z"
              fill="currentColor"
            />
          </g>
        )}

        {/* 点击脉冲（菱形），始终存在，由 GSAP 控制 */}
        <path
          className="cursor-click-ring"
          d="M40 28L52 40L40 52L28 40Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  },
);

CursorSvg.displayName = "CursorSvg";
export default CursorSvg;
