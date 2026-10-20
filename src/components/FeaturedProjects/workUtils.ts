export function isUsableImage(src?: string): src is string {
  return typeof src === "string" && src !== "" && !src.endsWith("/");
}

export function canHover(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover:hover) and (pointer: fine)").matches
  );
}
