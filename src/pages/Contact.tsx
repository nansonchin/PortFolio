import { useRef } from "react";
import ContactBlock from "../components/Contact/ContactBlock";
import { useReveal } from "../hooks/useReveal";
import { useGlitchLoop } from "../hooks/useGlitchLoop";

function Contact() {
  const pageRef = useRef<HTMLElement | null>(null);

  useReveal(pageRef);
  useGlitchLoop(pageRef)
  return (
    <main ref={pageRef} className="bg-ink">
      <ContactBlock />
    </main>
  );
}

export default Contact;