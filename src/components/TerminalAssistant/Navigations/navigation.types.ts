export type NavigationTarget =
  | {
      type: "page";

      target: "home" | "projects" | "about" | "contact"; 
    }
  | {
      type: "project";

      slug: string;
    };

export type NavigationRequest = {
  target: NavigationTarget;
};
