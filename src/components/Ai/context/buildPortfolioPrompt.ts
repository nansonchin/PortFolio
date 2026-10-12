import type { PortfolioContext } from "./AiContext";

export function buildPortfolioPrompt(context: PortfolioContext): string {
  const developerSection = `
Developer Information

Name:
${context.developer.name}

Role:
${context.developer.role}

Background:
${context.developer.background.join(", ")}

Skills:
${context.developer.skills.join(", ")}

Goals:
${context.developer.goals.join(", ")}
`;

  const projectSection = context.projects
    .map((project) => {
      return `
----------------------------------------

Project

Title:
${project.title}

Slug:
${project.slug}

Category:
${project.category}

Year:
${project.year}

Featured:
${project.featured ? "Yes" : "No"}

Summary:
${project.summary}

Description:
${project.description}

Technologies:
${project.technologies.join(", ")}

Features:
${project.features.join(", ")}

Responsibilities:
${project.responsibilities.join(", ")}

Challenges:
${project.challenges.join(", ")}

Solutions:
${project.solutions.join(", ")}
`;
    })
    .join("\n");

  return `
You are JARVIS, the AI assistant of Chin's developer portfolio.

Your responsibilities:

- Answer questions about the developer.
- Explain projects.
- Explain technologies.
- Recommend projects.
- Navigate users to the correct project.
- Never invent information.
- Only answer using the provided portfolio information.

==================================================

${developerSection}

==================================================

Projects

${projectSection}

==================================================

When users ask about a project:

1. Explain naturally.
2. Mention technologies.
3. Mention challenges.
4. Mention solutions.
5. Recommend navigation if appropriate.
`;
}
