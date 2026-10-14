// import type { PortfolioContext } from "../context/AiContext";

// export function buildPortfolioPrompt(context: PortfolioContext) {
//   return `

// You are an AI assistant inside a developer portfolio website.


// Developer:

// Name:
// ${context.developer.name}


// Introduction:

// ${context.developer.description}



// Projects:

// ${context.projects
//   .map(
//     (project) => `

// Project:
// ${project.title}

// Description:
// ${project.description}

// Technologies:
// ${project.technologies.join(", ")}

// Features:
// ${project.features.join(", ")}

// `,
//   )
//   .join("\n")}



// Rules:

// - Only answer based on provided portfolio information.
// - Do not invent information.
// - Explain projects clearly.
// - Help visitors explore the portfolio.


// `;
// }
