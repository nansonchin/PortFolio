import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import type { Project } from "../../entities/Project";
import { useCursorPhysics } from "../Cursor/CursorPhysicsContext";
import ProjectThumb from "./ProjectThumb";
import { canHover } from "./workUtils";

const OFFSET = 56; 
const EDGE = 16; 

type WorkPreviewProps = {
  items: Project[];
  activeIndex: number | null;
};

function WorkPreview({ items, activeIndex }: WorkPreviewProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const lastIndexRef = useRef(0);
  const { getPosition, subscribe } = useCursorPhysics();

  if (activeIndex !== null) lastIndexRef.current = activeIndex;
  const shownIndex = lastIndexRef.current;
  const shown = items[shownIndex];

  const computeTarget = useCallback(() => {
    const box = boxRef.current;
    if (!box) return null;

    const { x, y } = getPosition();
    const width = box.offsetWidth;
    const height = box.offsetHeight;

    let left = x + OFFSET;
    if (left + width > window.innerWidth - EDGE) left = x - OFFSET - width;
    left = Math.max(EDGE, left);

    const top = Math.min(
      Math.max(EDGE, y - height / 2),
      window.innerHeight - height - EDGE,
    );

    return { left, top };
  }, [getPosition]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !canHover()) return;

    gsap.set(box, { autoAlpha: 0, scale: 0.94 });

    const moveX = gsap.quickTo(box, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(box, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    const follow = () => {
      const target = computeTarget();
      if (!target) return;
      moveX(target.left);
      moveY(target.top);
    };

    const unsubscribe = subscribe(follow);

    return () => {
      unsubscribe();
      gsap.killTweensOf(box);
    };
  }, [subscribe, computeTarget]);

  const isVisible = activeIndex !== null;

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !canHover()) return;

    if (isVisible) {
      const target = computeTarget();
      if (target) gsap.set(box, { x: target.left, y: target.top });

      gsap.to(box, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(box, {
        autoAlpha: 0,
        scale: 0.94,
        duration: 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [isVisible, computeTarget]);

  return createPortal(
    <div
      ref={boxRef}
      data-work-preview
      aria-hidden="true"
      className="pointer-events-none invisible fixed left-0 top-0 z-40 w-[min(32vw,440px)] border border-gold/40 bg-ink opacity-0 will-change-transform"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: index === shownIndex ? 1 : 0 }}
          >
            <ProjectThumb src={item.thumbnail} alt="" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-gold/30 px-3 py-2">
        <span className="label text-gold">
          [ {String(shownIndex + 1).padStart(2, "0")} ]
        </span>
        <span className="label truncate text-paper">{shown?.title}</span>
      </div>
    </div>,
    document.body,
  );
}

export default WorkPreview;
