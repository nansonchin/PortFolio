import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";

export function generateProjectExplanation(
  project: ProjectAiContext,
): string[] {
  const lines: string[] = [];

  /**
   * Introduction
   */
  lines.push(`I found ${project.title}.`);

  lines.push("");

  /**
   * Description
   */
  lines.push(project.description);

  lines.push("");

  /**
   * Technology
   */
  if (project.technologies.length > 0) {
    lines.push("Key technologies:");

    project.technologies.forEach((tech) => {
      lines.push(`✓ ${tech}`);
    });

    lines.push("");
  }

  /**
   * Features
   */
  if (project.features.length > 0) {
    lines.push("Main features:");

    project.features.forEach((feature) => {
      lines.push(`✓ ${feature}`);
    });

    lines.push("");
  }

  /**
   * Architecture hint
   */
  if (project.architecture) {
    lines.push("This project also includes an architecture overview.");
  }

  lines.push("");

  lines.push("Would you like me to open this project?");

  return lines;
}
