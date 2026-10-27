import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../../animations/glitch";
import gsap from "gsap";
import type { TranslationKey } from "../../il8n/locales/en";
import { useLanguage } from "../../il8n/LanguageContext";

const NAV_LINKS: {
  to: string;
  label: TranslationKey;
  index: string;
  end: boolean;
}[] = [
  { to: "/", label: "nav.home", index: "01", end: true },
  { to: "/projects", label: "nav.projects", index: "02", end: false },
  { to: "/about", label: "nav.about", index: "03", end: false },
  { to: "/contact", label: "nav.contact", index: "04", end: false },
];

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
  }, [isOpen, lenis]);

  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;

      if (prefersReducedMotion()) {
        gsap.set(menu, { autoAlpha: isOpen ? 1 : 0 });
        return;
      }

      if (isOpen) {
        gsap.set(".mobile-nav-link", { autoAlpha: 0, x: -24 });

        gsap
          .timeline()
          .fromTo(
            menu,
            { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
            {
              autoAlpha: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.45,
              ease: "power3.inOut",
            },
          )
          .to(
            ".mobile-nav-link",
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.07,
              ease: "power3.out",
            },
            "-=0.15",
          );
      } else {
        gsap.to(menu, {
          autoAlpha: 0,
          clipPath: "inset(0 0 100% 0)",
          duration: 0.35,
          ease: "power3.inOut",
        });
      }
    },

    { scope: menuRef, dependencies: [isOpen] },
  );
   const { t } = useLanguage();

  return (
    <div
      ref={menuRef}
      id="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      data-cursor-ignore
      className="fixed inset-0 z-[9996] flex flex-col bg-ink"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <div className="h-16 shrink-0 border-b border-line" />

      <nav className="flex flex-1 flex-col justify-center px-8">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `mobile-nav-link bar-select flex items-baseline gap-6 border-b border-line py-7
               ${isActive ? "text-ink" : ""}`
            }
          >
            <span className="label opacity-60">{link.index}</span>

            <span className="font-display text-5xl uppercase leading-none">
               {t(link.label)}
            </span>
          </NavLink>
        ))}
      </nav>

      <p className="label shrink-0 px-8 py-6 text-gold-dim">
        PORTFOLIO_OS <span className="text-gold-bright">v1.0</span>
      </p>
    </div>
  );
}
