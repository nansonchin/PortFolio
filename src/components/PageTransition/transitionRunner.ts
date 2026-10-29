export type TransitionVariant = "full" | "standard" | "quick";

type Runner = (
  commit: () => void,
  label: string,
  variant: TransitionVariant,
) => void;

let runner: Runner | null = null;

export function registerTransitionRunner(fn: Runner) {
  runner = fn;
  return () => {
    if (runner === fn) runner = null;
  };
}

export function runPageTransition(
  commit: () => void,
  label: string,
  variant: TransitionVariant = "quick",
) {
  if (!runner) {
    commit();
    return;
  }
  runner(commit, label, variant);
}