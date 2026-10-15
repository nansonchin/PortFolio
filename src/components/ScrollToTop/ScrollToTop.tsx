import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, lenis]);

  return null;
}

export default ScrollToTop;
