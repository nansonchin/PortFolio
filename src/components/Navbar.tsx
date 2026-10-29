import { useCallback, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { developerContext } from "../data/developerContext";
import NavHamburger from "./Navbar/NavHamburger";
import MobileMenu from "./Navbar/MobileMenu";
import LanguageSwitch from "../il8n/LanguageSwitch";
import { useLanguage } from "../il8n/LanguageContext";
import type { TranslationKey } from "../il8n/locales/en";
import TransitionLink from "./PageTransition/TransitionLink";
import TransitionNavLink from "./PageTransition/TransitionNavLink";

const NAV_LINKS : { to: string; label: TranslationKey; end: boolean }[] = [
  { to: "/", label: "nav.home", end: true },
  { to: "/projects", label: "nav.projects", end: false },
  { to: "/about", label: "nav.about", end: false },
  { to: "/contact", label: "nav.contact", end: false },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const close = useCallback(() => setMenuOpen(false), []);
  const toggle = useCallback(() => setMenuOpen((prev) => !prev), []);
 const { t } = useLanguage();
  return (
    <>
      <nav
        className="
          fixed left-0 top-0
          z-[9997]
          flex w-full items-center justify-between
          border-b border-line
          bg-ink/60 px-6 py-4
          backdrop-blur-sm
          md:px-10
        "
      >
        <TransitionLink
          to="/"
          onClick={close}
          className="font-system text-sm tracking-[0.3em] text-gold-bright"
        >
          [{developerContext.name.toUpperCase()}
          <span className="blink">_</span>]
        </TransitionLink>

        <ul className="hidden items-center gap-2 md:flex">
          {NAV_LINKS.map((item, i) => (
            <li key={item.to}>
              <TransitionNavLink
                to={item.to}
                end={item.end}
                className="bar-select label block px-4 py-2"
              >
                <span className="mr-2 opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(item.label)}
              </TransitionNavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <p className="label hidden text-gold-dim md:block">
            SYS <span className="text-gold-bright">ONLINE</span>
          </p>
           <LanguageSwitch />
          <NavHamburger isOpen={menuOpen} onClick={toggle} />
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={close} />
    </>
  );
}

export default Navbar;