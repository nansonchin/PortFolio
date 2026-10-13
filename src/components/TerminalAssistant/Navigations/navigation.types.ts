export type NavigationTarget =
  | {
      type: "page";

      target: "home" | "projects" | "about"; 
    }
  | {
      type: "project";

      slug: string;
    };

export type NavigationRequest = {
  target: NavigationTarget;
};
