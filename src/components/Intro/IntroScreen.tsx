import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { useIntro } from "../../hooks/useIntro";
import { useBootAssets } from "./useBootAssets";
import { buildBootLines } from "./bootScript";
import { introLog } from "./introLog";
import {
  createBootSequence,
  createExitSequence,
} from "../../animations/introAnimation";
import GlitchText from "../GlitchText/GlitchText";

function statusClass(status: string) {
  if (status === "??") return "text-alert";
  if (status === "ONLINE") return "text-gold-bright glow-gold";
  return "text-gold-bright";
}

function IntroStage() {
  const { startReveal, completeIntro } = useIntro();
  const { files, progress, ready } = useBootAssets();
  const lines = useMemo(() => buildBootLines(files), [files]);

  const rootRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const paceRef = useRef<{ value: number }>({ value: 0 });
  const bootTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressRef = useRef(0);
  const shownRef = useRef(0);
  const exitStartedRef = useRef(false);
  const playExitRef = useRef<() => void>(() => {});

  /* 1. 开机期间暂停平滑滚动 */
  const lenis = useLenis();
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  /* 2. 把真实进度同步给 ticker 用 */
  useEffect(() => {
    progressRef.current = ready ? 1 : progress;
  }, [progress, ready]);

  /* 3. 开机时间线 */
  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const { timeline, pace } = createBootSequence(root);
      paceRef.current = pace;
      bootTimelineRef.current = timeline;
      introLog("boot sequence start", { lines: lines.length });
    },
    { scope: rootRef },
  );

  /* 4. 退场（用 contextSafe 包起来，卸载时会被一起清掉）*/
  const playExit = contextSafe(() => {
    const root = rootRef.current;
    if (!root) return;

    introLog("exit sequence start");
    createExitSequence({
      root,
      onReveal: () => {
        introLog("reveal -> hero starts");
        startReveal();
      },
      onDone: () => {
        introLog("intro done");
        completeIntro();
      },
    });
  });

  useEffect(() => {
    playExitRef.current = playExit;
  });

  /* 5. 更新右下角数字和进度线 */
  const renderPercent = useCallback((value: number) => {
    const text = `${String(Math.round(value * 100)).padStart(3, "0")}%`;
    const element = percentRef.current;

    if (element && element.textContent !== text) {
      element.textContent = text;
      element.dataset.text = text;
    }
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${value})`;
    }
  }, []);

  /* 6. 每一帧：画面进度 = min(真实进度, 脚本节奏)，再缓动过去 */
  useEffect(() => {
    const tick = () => {
      const target = Math.min(progressRef.current, paceRef.current.value);

      shownRef.current += (target - shownRef.current) * 0.18;
      if (target - shownRef.current < 0.002) shownRef.current = target;

      renderPercent(shownRef.current);

      if (shownRef.current >= 1 && !exitStartedRef.current) {
        exitStartedRef.current = true;
        playExitRef.current();
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [renderPercent]);

  /* 7. 跳过：点击或按任意键 */
  const skip = useCallback(() => {
    if (exitStartedRef.current) return;

    introLog("skip requested");
    exitStartedRef.current = true;
    progressRef.current = 1;

    bootTimelineRef.current?.progress(1, false); // false：让中间的回调也执行
    shownRef.current = 1;
    renderPercent(1);

    playExitRef.current();
  }, [renderPercent]);

  useEffect(() => {
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [skip]);

  return (
    <div
      ref={rootRef}
      data-cursor-ignore
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      onClick={skip}
      className="fixed inset-0 z-[90000] overflow-hidden font-system"
    >
      {/* 两块幕布 */}
      <div className="boot-panel-top absolute left-0 top-0 h-1/2 w-full bg-ink" />
      <div className="boot-panel-bottom absolute bottom-0 left-0 h-1/2 w-full bg-ink" />

      {/* CRT 开机亮线 */}
      <div className="boot-flash pointer-events-none absolute inset-0 bg-gold-bright opacity-0" />

      {/* 内容 */}
      <div className="boot-content absolute inset-0 flex flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div className="w-full max-w-xl text-xs leading-7 md:text-sm">
            {lines.map((line) => (
              <p
                key={line.id}
                data-kind={line.kind}
                className="boot-line flex items-baseline gap-3 opacity-0"
              >
                <span
                  className={`boot-text inline-block whitespace-nowrap ${
                    line.kind === "header"
                      ? "text-gold-bright"
                      : "text-paper/80"
                  }`}
                >
                  {"> "}
                  {line.text}
                  {line.kind === "final" && (
                    <span className="blink ml-1">▌</span>
                  )}
                </span>

                {line.status && (
                  <>
                    <span className="boot-dots boot-late h-px flex-1 self-center border-b border-dotted border-gold-dim/60 opacity-0" />
                    <GlitchText
                      text={line.status}
                      className={`boot-status boot-late opacity-0 ${statusClass(line.status)}`}
                    />
                  </>
                )}
              </p>
            ))}
          </div>

          <p className="label hidden text-gold-dim md:block">
            PORTFOLIO_OS / v1.0
          </p>
        </div>

        <div>
          <div className="mb-4 flex items-end justify-between gap-6">
            <p className="boot-skip label text-gold-dim opacity-0">
              Press any key to skip
            </p>

            <span
              ref={percentRef}
              data-text="000%"
              className="glitch boot-percent font-display leading-none text-gold glow-gold"
              style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}
            >
              000%
            </span>
          </div>

          <div className="h-px w-full bg-line">
            <div
              ref={barRef}
              className="h-[2px] w-full origin-left bg-gold"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>

      {/* 退场时的中线 */}
      <div className="boot-seam pointer-events-none absolute left-0 top-1/2 z-10 h-px w-full bg-gold-bright opacity-0" />
    </div>
  );
}

/** 门卫：阶段是 done 就不渲染，也不会去预加载任何东西 */
export default function IntroScreen() {
  const { phase } = useIntro();
  if (phase === "done") return null;
  return <IntroStage />;
}
