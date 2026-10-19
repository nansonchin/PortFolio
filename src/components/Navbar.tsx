import { Link, NavLink } from "react-router-dom";
import { developerContext } from "../data/developerContext";
import type { TranslationKey } from "../il8n/locales/en";
import { useLanguage } from "../il8n/LanguageContext";
import LanguageSwitch from "../il8n/LanguageSwitch";

// labels are now KEYS, not text
const links: { to: string; label: TranslationKey; end: boolean }[] = [
  { to: "/", label: "nav.home", end: true },
  { to: "/projects", label: "nav.projects", end: false },
  { to: "/about", label: "nav.about", end: false },
  { to: "/contact", label: "nav.contact", end: false },
];

function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-line bg-ink/60 px-6 py-4 backdrop-blur-sm md:px-10">
      <Link to="/" className="font-system text-sm tracking-[0.3em] text-gold-bright">
        [ {developerContext.name.toUpperCase()}
        <span className="blink">_</span> ]
      </Link>

      <ul className="hidden items-center gap-2 md:flex">
        {links.map((item, i) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.end} className="bar-select label block px-4 py-2">
              <span className="mr-2 opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {t(item.label)}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        {/* system status stays English on purpose: it is the "OS voice" */}
        <p className="label hidden text-gold-dim md:block">
          SYS <span className="text-gold-bright">ONLINE</span>
        </p>

        <LanguageSwitch />
      </div>
    </nav>
  );
}

export default Navbar;