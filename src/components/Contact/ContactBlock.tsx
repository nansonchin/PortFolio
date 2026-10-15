import { useCallback, useEffect, useRef, useState } from "react";
import { glitchBurst } from "../../animations/glitch";
import { getContactLinks, profile } from "../../data/profile";
import GlitchText from "../GlitchText/GlitchText";
import SectionLabel from "../SectionLabel/SectionLabel";

const pad = (value: number) => String(value).padStart(2, "0");

function ContactBlock() {
  const links = getContactLinks();
  const [copied, setCopied] = useState(false);
  const labelRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const [glitchCount, setGlitchCount] = useState(0);
  const linkRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [glitchLinks, setGlitchLinks] = useState<Set<string>>(new Set());

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    label: string,
    href: string,
  ) => {
     if (href) return;

     event.preventDefault()
    setGlitchLinks((prev) => {
      const next = new Set(prev);
      next.add(label);
      return next;
    });

    const element = linkRefs.current.get(label);
    glitchBurst(element?.querySelector<HTMLElement>(".glitch"), 380);
  };

  useEffect(() => {
    if (glitchCount === 0) return;
    glitchBurst(labelRef.current?.querySelector<HTMLElement>(".glitch"), 380);
  }, [glitchCount]);

  const copyEmail = useCallback(async () => {
    // if (!profile.email) return;
    setCopied(true);
    setGlitchCount((count) => count + 1);
    // try {
    //   await navigator.clipboard.writeText(profile.email);

    //   setCopied(true);
    //   window.clearTimeout(timerRef.current);
    //   timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    // } catch (error) {
    //   window.location.href = `mailto:${profile.email}`;
    // }
  }, []);

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 pb-20 pt-36 md:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div data-reveal>
          <SectionLabel index="03" text="CONTACT" className="mb-10" />
        </div>

        <h1
          data-reveal
          className="font-display text-[clamp(3rem,10vw,9.5rem)] uppercase leading-[0.9] text-paper"
        >
          <span className="block">Let&apos;s build</span>
          <span className="block italic text-gold-bright">something.</span>
        </h1>

        <p
          data-reveal
          className="mt-8 flex items-center gap-3 font-system text-sm tracking-wide text-gold-bright"
        >
          <span className="blink h-2 w-2 bg-gold-bright" />
          {profile.status.toUpperCase()}
        </p>

        {profile.email && (
          <button
            type="button"
            data-reveal
            data-magnetic
            onClick={copyEmail}
            aria-label={`Copy email address ${profile.email}`}
            className="bar-select mt-12 flex w-full max-w-xl items-center justify-between gap-6 border border-gold/60 px-5 py-4 text-left"
          >
            <span ref={labelRef} className="label">
              <GlitchText text={copied ? "ERROR COPIED" : ""} />
            </span>
            <span className="truncate font-system text-sm">
              {profile.email}
            </span>
          </button>
        )}

        <ul className="mt-16 border-t border-line">
          {links.map((link, index) => (
            <li key={link.label} data-reveal className="border-b border-line">
              <a
                href={link.href || undefined}
                onClick={(event) => {
                  handleClick(event, link.label, link.href);
                }}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                data-cursor={link.cursor}
                className="bar-select grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 px-3 py-6 md:grid-cols-[4rem_14rem_1fr_2rem] md:gap-x-8 md:px-6 md:py-8"
              >
                <span className="label opacity-60">{pad(index + 1)}</span>
                <span className="font-display text-3xl uppercase md:text-5xl">
                  {link.label}
                </span>
                <span className="hidden truncate font-system text-sm opacity-60 md:block">
                  {link.display}
                </span>
                <span
                  ref={(element) => {
                    if (element) {
                      linkRefs.current.set(link.label, element);
                    } else {
                      linkRefs.current.delete(link.label);
                    }
                  }}
                  className="label justify-self-end flex-col flex"
                >
                  <GlitchText
                    text={glitchLinks.has(link.label) ? "ERROR" : "Go"}
                  />
                  <div className="text-end">{link.external ? "↗" : "→"}</div>
                </span>

                <span className="col-start-2 col-end-[-1] mt-2 truncate font-system text-xs opacity-60 md:hidden">
                  {link.display}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ContactBlock;
