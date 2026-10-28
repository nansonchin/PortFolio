type Runner = (commit: () => void, label: string) => void;

let runner: Runner | null = null;

export function registerTransitionRunner(fn: Runner) {
  runner = fn;
  return () => {
    if (runner === fn) runner = null;
  };
}

export function runPageTransition(commit: () => void, label: string) {
  if (!runner) {
    commit();
    return;
  }
  runner(commit, label);
}