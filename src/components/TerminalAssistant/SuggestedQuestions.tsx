import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../animations/glitch";

type SuggestedQuestionsProps = {
  questions: string[];
  onSelect: (question: string) => void;
  visible: boolean;
};

function SuggestedQuestions({ questions, onSelect, visible }: SuggestedQuestionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      if (prefersReducedMotion()) {
        gsap.set(container, { autoAlpha: visible ? 1 : 0 });
        return;
      }

      if (visible) {
        gsap.set(container, { autoAlpha: 1 });
        gsap.fromTo(
          ".suggestion-btn",
          { autoAlpha: 0, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.35,
            stagger: 0.06,
            ease: "power3.out",
          },
        );
      } else {
        gsap.to(container, {
          autoAlpha: 0,
          duration: 0.2,
          ease: "power2.in",
          onComplete:()=>{
            gsap.set(container,{display:"none"})
          }
        });
      }
    },
    { scope: containerRef, dependencies: [visible] },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-2 px-4 pb-3 pt-1"
      style={{ visibility: "hidden", opacity: 0 }} 
    >
      <p className="label text-gold-dim opacity-70">[ SUGGESTIONS ]</p>

      {questions.map((question) => (
        <button
          key={question}
          type="button"
          onClick={() => onSelect(question)}
          className="
            suggestion-btn
            bar-select
            label
            flex items-center gap-3
            border border-line
            px-4 py-2.5
            text-left
          "
        >
          <span className="text-gold opacity-60">&gt;</span>
          <span className="normal-case tracking-normal">
            {question}
          </span>
        </button>
      ))}
    </div>
  );
}

export default SuggestedQuestions;