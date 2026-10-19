export type Language = "en" | "zh";

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGES: { code: Language; label: string; htmlLang: string }[] = [
  { code: "en", label: "EN", htmlLang: "en" },
  { code: "zh", label: "中文", htmlLang: "zh-CN" },
];