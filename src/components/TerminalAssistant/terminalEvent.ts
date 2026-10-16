export const JARVIS_OPEN_EVENT = "jarvis:open";

export type JarvisOpenDetail = {
  prompt?: string;
};

export function openJarvis(prompt?: string) {
  window.dispatchEvent(
    new CustomEvent<JarvisOpenDetail>(JARVIS_OPEN_EVENT, { detail: { prompt } }),
  );
}