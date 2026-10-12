import { buildProjectContext } from "../../../components/Ai/context/buildProjectAiContextMapper";

import { detectIntent } from "../intelligence/detectIntent";

import { generateProjectExplanation } from "../intelligence/projectIntelligence";

import { answerProjectQuestion } from "../intelligence/projectQuestion";

import {
  addConversation,
  setCurrentProject,
  setLastIntent,
  setLastAction,
} from "../memory/assistantMemory";

import { searchProjects } from "../services/projectSearchService";

import { calculateConfidence } from "../services/confidenceService";

import { makeDecision } from "../decisions/decisionEngine";

import { createPlan } from "../planner/plannerEngine";

import { executePlan } from "../planner/planExecutor";

import type { AssistantResponse } from "./assistant.types";

export async function assistantEngine(
  input: string,
): Promise<AssistantResponse> {
  /**
   * =================================
   * 1. Store User Message
   * =================================
   */

  addConversation({
    role: "user",

    content: input,
  });

  /**
   * =================================
   * 2. Understand User Intent
   * =================================
   */

  const intent = detectIntent(input);

  setLastIntent(intent);

  /**
   * =================================
   * 3. Build AI Knowledge
   * =================================
   */

  const projects = buildProjectContext();

  /**
   * =================================
   * 4. Retrieve Project
   * =================================
   */

  const results = searchProjects(input, projects);

  const bestMatch = results[0];

  /**
   * =================================
   * 5. Confidence Calculation
   * =================================
   */

  const confidence = bestMatch ? calculateConfidence(bestMatch.score) : 0;

  /**
   * =================================
   * 6. Decision Layer
   * =================================
   */

  const decision = makeDecision({
    intent,

    confidence,

    path: bestMatch ? `/project/${bestMatch.project.slug}` : undefined,
  });

  /**
   * =================================
   * 7. Planner Layer
   * =================================
   */

  const plan = createPlan(decision);

  /**
   * =================================
   * 8. Execute Plan
   * =================================
   */

  const execution = executePlan({
    plan,

    projectResult: bestMatch,
  });

  /**
   * =================================
   * 9. Handle Decision Result
   * =================================
   */

  switch (decision.type) {
    /**
     * ==========================
     * Navigate
     * ==========================
     */

    case "navigate": {
      if (!bestMatch) {
        return createAssistantResponse({
          intent: "general",

          message: "I couldn't find the project.",
        });
      }

      setCurrentProject(bestMatch.project);

      setLastAction({
        type: "navigate",

        value: `/project/${bestMatch.project.slug}`,
      });

      return createAssistantResponse({
        intent: "navigate",

        message: `
I found ${bestMatch.project.title}.


Why this project matches:

${bestMatch.reasons.map((reason) => `✓ ${reason}`).join("\n")}



Execution:

${execution.logs.join("\n")}

`,

        action: {
          type: "navigate",

          path: `/project/${bestMatch.project.slug}`,
        },
      });
    }

    /**
     * ==========================
     * Ask User
     * ==========================
     */

    case "ask": {
      return createAssistantResponse({
        intent: "general",

        message: decision.question,
      });
    }

    /**
     * ==========================
     * Answer
     * ==========================
     */

    case "answer": {
      /**
       * Check conversation memory
       */

      const projectAnswer = answerProjectQuestion(input);

      if (projectAnswer) {
        return createAssistantResponse({
          intent: "architecture",

          message: projectAnswer.message,
        });
      }

      if (bestMatch) {
        setCurrentProject(bestMatch.project);

        const explanation = generateProjectExplanation(bestMatch.project);

        return createAssistantResponse({
          intent: "project_info",

          message: explanation.join("\n"),
        });
      }

      return createAssistantResponse({
        intent: "general",

        message: `
I can help you explore this portfolio.

Try asking:

- Show me React projects
- Explain Manga Reader
- Show architecture
- Open a project

`,
      });
    }

    /**
     * ==========================
     * General
     * ==========================
     */

    case "general":

    default: {
      return createAssistantResponse({
        intent: "general",

        message: `
I am your portfolio assistant.

You can ask:

- Show me a project
- Explain a project
- Show architecture
- Open project

`,
      });
    }
  }
}

/**
 * =================================
 * Save Assistant Response
 * =================================
 */

function createAssistantResponse(
  response: AssistantResponse,
): AssistantResponse {
  addConversation({
    role: "assistant",

    content: response.message,
  });

  return response;
}
