import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";

export function buildArchitectureResponse(project: ProjectAiContext) {
  const architecture = project.architecture;

  if (!architecture) {
    return `
${project.title}
does not have architecture documentation yet.
`;
  }

  return `
${project.title} architecture:


${architecture.description}


Main Layers:


${architecture.root.children?.map((layer) => `✓ ${layer.title}`).join("\n")}
`;
}
