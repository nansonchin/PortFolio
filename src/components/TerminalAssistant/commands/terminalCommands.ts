import { projectRepository } from "../../../repository/ProjectRepository";
import type {
  TerminalCommand,
  TerminalCommandName,
} from "../../../types/terminal.types";
import { resolveNavigationPath } from "../Navigations/navigationService";

export const terminalCommands: Record<TerminalCommandName, TerminalCommand> = {
  help: {
    name: "help",

    description: "Show all available commands",

    aliases: ["h", "commands"],

    execute: async () => ({
      type: "output",

      lines: [
        "Available commands:",
        "",
        "help       - Show commands",
        "clear      - Clear terminal",
        "about      - About developer",
        "navigate   - Navigate pages",
      ],
    }),
  },
  projects: {
    name: "projects",

    description: "Explore projects",

    aliases: ["p"],

    execute: async () => {
      const projects = projectRepository.getAll();

      const lines: string[] = ["Available Projects:", ""];

      projects.forEach((project, index) => {
        lines.push(`${index + 1}. ${project.title}`);

        lines.push(`   category: ${project.category}`);

        lines.push(`   year: ${project.year}`);

        lines.push(`   stack: ${project.technologies.join(", ")}`);

        lines.push(`   slug: ${project.slug}`);

        lines.push("");
      });

      lines.push("Use:", "navigate project <slug>");

      return {
        type: "output",

        lines,
      };
    },
  },

  about: {
    name: "about",

    description: "About developer",

    aliases: ["whoami"],

    execute: async () => ({
      type: "output",

      lines: ["Developer portfolio terminal."],
    }),
  },

  clear: {
    name: "clear",

    description: "Clear terminal",

    aliases: ["cls"],

    execute: async () => ({
      type: "clear",

      lines: [],
    }),
  },

  navigate: {
    name: "navigate",

    description: "Navigate pages or projects",

    aliases: ["goto"],

    execute: async (args) => {
      const target = args[0];

      if (!target) {
        return {
          type: "output",

          lines: [
            "Usage:",

            "navigate projects",

            "navigate about",

            "navigate project <slug>",
          ],
        };
      }

      /**
       * Project Detail Navigation
       */
      if (target === "project") {
        const slug = args[1];

        if (!slug) {
          return {
            type: "output",

            lines: ["Missing project slug"],
          };
        }

        const project = projectRepository.getBySlug(slug);

        if (!project) {
          return {
            type: "unknown",

            lines: [`✗ Project not found: ${slug}`],
          };
        }

        return {
          type: "navigation",

          path: resolveNavigationPath({
            type: "project",
            slug,
          }),

          lines: ["✓ Opening project:", project.title],
        };
      }

      /**
       * Normal Pages
       */
      if (target === "projects" || target === "about") {
        return {
          type: "navigation",

          path: resolveNavigationPath({
            type: "page",

            target,
          }),

          lines: [`✓ Opening ${target}`],
        };
      }

      return {
        type: "unknown",

        lines: [`Unknown navigation target: ${target}`],
      };
    },
  },
};
