import type { MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import type { TransitionVariant } from "../components/PageTransition/transitionRunner";
import { useTransitionNavigate } from "./useTransitionNavigate";

type Options = {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  variant?: TransitionVariant;
};

export function useTransitionClick(to: string, options: Options = {}) {
  const { onClick, target, variant = "quick" } = options;
  const go = useTransitionNavigate();
  const { pathname, search } = useLocation();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== "_self") return;
    if (to === pathname + search) return; 

    event.preventDefault();
    go(to, { variant });
  };
}