import type { NavigationTarget } from "./navigation.types";

export function resolveNavigationPath(request: NavigationTarget) {
  switch (request.type) {
    case "page":
      switch (request.target) {
        case "home":
          return "/";
        case "projects":
          return "/projects";
        case "about":
          return "/about";
        case "contact":
          return "/contact"
        default:
          return "/";
      }

    case "project":
      return `/project/${request.slug}`;

    default:
      return "/";
  }
}
