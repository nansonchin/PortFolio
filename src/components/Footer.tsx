import { developerContext } from "../data/developerContext";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-3 border-t border-line px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
      <p className="label text-gold-dim">
        © {year} {developerContext.name.toUpperCase()} // ALL SYSTEMS NOMINAL
      </p>
      <p className="label text-gold-dim">
        PORTFOLIO_OS <span className="text-gold-bright">v1.0</span>
      </p>
    </footer>
  );
}

export default Footer;