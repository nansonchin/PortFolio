import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { developerContext } from "../../data/developerContext";
import { projectRepository } from "../../repository/ProjectRepository";
import { prefersReducedMotion } from "../../animations/glitch";
import { heroLog } from "./heroLog";

const SECONDS_PER_ITEM = 2.4; // 每个词约走过 2.4 秒（决定整体速度）
const MAX_EXTRA_SPEED = 5;     // 滚动时最多额外加速几倍
const SPEED_PER_VELOCITY = 0.08;

function collectTechItems(): string[] {
  const unique = new Set<string>();

  developerContext.skills.forEach((skill) => unique.add(skill.toUpperCase()));
  projectRepository.getAll().forEach((project) => {
    project.technologies.forEach((tech) => unique.add(tech.toUpperCase()));
  });

  return [...unique];
}

function TechMarquee() {
  const items = useMemo(collectTechItems, []);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || items.length === 0 || prefersReducedMotion()) return;

      const duration = items.length * SECONDS_PER_ITEM;

      // 内容复制了一份，所以移动 -50% 刚好回到起点，接缝看不出来
      loopRef.current = gsap.to(track, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });

      heroLog("marquee", { items: items.length, secondsPerLoop: duration });

      return () => {
        loopRef.current = null;
      };
    },
    { dependencies: [items] },
  );

  // 滚动越快，跑马灯越快；停下后慢慢恢复
  useLenis((lenis) => {
    const loop = loopRef.current;
    if (!loop) return;

    const extra = Math.min(Math.abs(lenis.velocity) * SPEED_PER_VELOCITY, MAX_EXTRA_SPEED);

    loop.timeScale(1 + extra);
    gsap.to(loop, { timeScale: 1, duration: 0.9, ease: "power2.out", overwrite: true });
  });

  return (
    <div className="hero-marquee relative border-y border-line py-4">
      <p className="sr-only">Tech stack: {items.join(", ")}</p>

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div ref={trackRef} aria-hidden="true" className="flex w-max items-center whitespace-nowrap will-change-transform">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`} className="label flex items-center gap-10 pr-10 text-gold-dim">
              {item}
              <span className="text-gold">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TechMarquee;