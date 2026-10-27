import { useEffect } from "react";

const SITE_NAME = "Chin Portfolio";
const BASE_TITLE = "Chin | Frontend Developer";
const BASE_DESCRIPTION =
  "Frontend developer portfolio. React, TypeScript, GSAP and AI integration. Ask JARVIS to explore.";

type SEOProps = {
  title?: string;
  description?: string;
};

export function useSEO({ title, description }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : BASE_TITLE;
  const fullDescription = description ?? BASE_DESCRIPTION;

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector<HTMLMetaElement>('meta[name="description"]')
        ?.content ?? "";

    document.title = fullTitle;

    const descriptionEl = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (descriptionEl) {
      descriptionEl.content = fullDescription;
    }

    return () => {
      document.title = previousTitle;
      if (descriptionEl) {
        descriptionEl.content = previousDescription;
      }
    };
  });
}
