import { Link } from "react-router-dom";
import { developerContext } from "../data/developerContext";
import { getContactLinks } from "../data/profile";
import { useLanguage } from "../il8n/LanguageContext";
import type { TranslationKey } from "../il8n/locales/en";
import TransitionLink from "./PageTransition/TransitionLink";

const navLinks: { to: string; label: TranslationKey }[] = [
  { to: "/projects", label: "nav.projects" },
  { to: "/about", label: "nav.about" },
  { to: "/contact", label: "nav.contact" },
];

const linkClass = "label text-gold-dim transition-colors hover:text-gold-bright";

function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const contactLinks = getContactLinks();

  return (
    <footer className="border-t border-line px-6 py-10 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <p className="label text-gold-dim">
            © {year} {developerContext.name.toUpperCase()} // ALL SYSTEMS NOMINAL
          </p>
          <p className="label text-gold-dim">
            PORTFOLIO_OS <span className="text-gold-bright">v1.0</span>
          </p>
        </div>

        <nav aria-label={t("nav.footerAria")} className="flex flex-wrap gap-x-6 gap-y-2">
          {navLinks.map((item) => (
            <TransitionLink key={item.to} to={item.to} className={linkClass}>
              {t(item.label)}
            </TransitionLink>
          ))}
        </nav>

        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {contactLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={linkClass}
              >
                {link.label} {link.external ? "↗" : ""}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;