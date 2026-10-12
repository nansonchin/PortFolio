import { getAssistantMemory } from "../memory/assistantMemory";

export function answerProjectQuestion(input: string) {
  const memory = getAssistantMemory();

  if (!memory.currentProject) {
    return null;
  }

  const project = memory.currentProject;

  const message = input.toLowerCase();

  if (message.includes("architecture")) {
    const architecture = project.architecture;

    if (!architecture) {
      return {
        message: `${project.title} does not have architecture documentation yet.`,
      };
    }

    return {
      message: `
${project.title} architecture:

${architecture.description}

Main layers:

${architecture.root.children?.map((layer) => `✓ ${layer.title}`).join("\n")}
`,
    };
  }

  return null;
}
