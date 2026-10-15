import { Link, NavLink } from "react-router-dom";
import { developerContext } from "../data/developerContext";

const links = [
  { to: "/", label: "HOME", end: true },
  { to: "/projects", label: "PROJECTS", end: false },
  { to: "/about", label: "ABOUT", end: false },
    { to: "/contact", label: "CONTACT", end: false },
];

function Navbar() {
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
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <p className="label hidden text-gold-dim md:block">
        SYS <span className="text-gold-bright">ONLINE</span>
      </p>
    </nav>
  );
}

export default Navbar;