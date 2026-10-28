import { useCallback } from "react";
import { useNavigate, type NavigateOptions } from "react-router-dom";
import { runPageTransition } from "../components/PageTransition/transitionRunner";

export function useTransitionNavigate() {
  const navigate = useNavigate();

  return useCallback(
    (to: string, options?: NavigateOptions) => {
      runPageTransition(() => navigate(to, options), to);
    },
    [navigate],
  );
}