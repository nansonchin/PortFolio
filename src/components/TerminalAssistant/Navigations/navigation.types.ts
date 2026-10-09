export type NavigationTarget =
  | {
      type: "page";

      target: "projects" | "about";
    }
  | {
      type: "project";

      slug: string;
    };

export type NavigationRequest = {
  target: NavigationTarget;
};
