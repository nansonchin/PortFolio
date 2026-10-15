export function isUsableImage(src?: string): src is string {
  return typeof src === "string" && src !== "" && !src.endsWith("/");
}

export function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover:hover) and (pointer: fine)").matches
  );
}

export function workLog(tag: string, data?: unknown) {
  if (!import.meta.env.DEV) return;

  if (data === undefined) {
    console.log(`%c[work] ${tag}`, "color:D8BD83");
  } else {
    console.log(`%c[work] ${tag}`, "color:D8BD83", data);
  }
}
