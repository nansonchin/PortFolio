import { useRef } from "react";
import ContactBlock from "../components/Contact/ContactBlock";
import { useReveal } from "../hooks/useReveal";

function Contact() {
  const pageRef = useRef<HTMLElement | null>(null);

  useReveal(pageRef);

  return (
    <main ref={pageRef} className="bg-ink">
      <ContactBlock />
    </main>
  );
}

export default Contact;