import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";
import {
  runPageTransition,
  type TransitionVariant,
} from "../components/PageTransition/transitionRunner";

export type TransitionNavigateOptions = NavigateOptions & {
  variant?: TransitionVariant;
};

export function useTransitionNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to: string, options: TransitionNavigateOptions = {}) => {
      const { variant = "quick", ...navOptions } = options;
      runPageTransition(() => navigate(to, navOptions), to, variant);
    },
    [navigate],
  );
}