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
      "text-[#D8BD83] drop-shadow-[0_0_1.5px_rgba(10,9,8,0.9)]",

    glowClassName:
      "bg-[#D8BD83]/40",

    labelClassName:
      "text-[#D8BD83]",
  },


  view: {
    svgClassName:
      "text-[#D8BD83] drop-shadow-[0_0_1.5px_rgba(10,9,8,0.9)]",

    glowClassName:
      "bg-[#D8BD83]/40",

    labelClassName:
      "text-[#D8BD83]",
  },


  code: {
    svgClassName:
      "text-[#D8BD83] drop-shadow-[0_0_1.5px_rgba(10,9,8,0.9)]",

    glowClassName:
      "bg-[#F7F7F7]/30",

    labelClassName:
      "text-[#F7F7F7]",
  },


  live: {
    svgClassName:
      "text-[#C8452F]",

    glowClassName:
      "bg-[#C8452F]/35",

    labelClassName:
      "text-[#C8452F]",
  },

};