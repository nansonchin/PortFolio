export const JARVIS_OPEN_EVENT = "jarvis:open";

export type JarvisOpenDetail = {
  prompt?: string;
};

export function openJarvis(prompt?: string) {
  window.dispatchEvent(
    new CustomEvent<JarvisOpenDetail>(JARVIS_OPEN_EVENT, {
      detail: { prompt },
    }),
  );
}

export const JARVIS_NAVIGATE_EVENT = "jarvis:navigate";

export type JarvisNavigateDetail = {
  path: string;
};

export function emitJarvisNavigate(path: string) {
  window.dispatchEvent(
    new CustomEvent<JarvisNavigateDetail>(JARVIS_NAVIGATE_EVENT, { detail: { path } }),
  );
}