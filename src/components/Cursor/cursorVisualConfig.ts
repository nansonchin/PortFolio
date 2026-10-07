export type CursorMode =
  | "default"
  | "view"
  | "code"
  | "live";


type CursorVisualConfig = {
  svgClassName: string;
  glowClassName: string;
  labelClassName: string;
};


export const cursorVisualConfig: Record<
  CursorMode,
  CursorVisualConfig
> = {

  default: {
    svgClassName:
      "text-[#FFDC22]",

    glowClassName:
      "bg-[#FFDC22]/40",

    labelClassName:
      "text-[#FFDC22]",
  },


  view: {
    svgClassName:
      "text-[#FFDC22]",

    glowClassName:
      "bg-[#FFDC22]/40",

    labelClassName:
      "text-[#FFDC22]",
  },


  code: {
    svgClassName:
      "text-[#F7F7F7]",

    glowClassName:
      "bg-[#F7F7F7]/30",

    labelClassName:
      "text-[#F7F7F7]",
  },


  live: {
    svgClassName:
      "text-[#F40404]",

    glowClassName:
      "bg-[#F40404]/35",

    labelClassName:
      "text-[#F40404]",
  },

};