import { buildProjectContext } from "../context/buildProjectAiContextMapper";

import { detectIntent } from "../../../features/assitant/intelligence/detectIntent";

import { searchProjects } from "../../../features/assitant/services/projectSearchService";

import { calculateConfidence } from "../../../features/assitant/services/confidenceService";

import { makeDecision } from "../../../features/assitant/decisions/decisionEngine";

import { createPlan } from "../../../features/assitant/planner/plannerEngine";

import { executePlan } from "../../../features/assitant/planner/planExecutor";

import type { AssistantResponse } from "../../../features/assitant/ai/assistant.types";

import type { SearchResult } from "../../../features/assitant/types/searchResult";
import { buildOrchestratorResponse } from "../responseBuilder/responseBuilder";

type OrchestratorResult = {
  response: AssistantResponse;
};

export async function aiOrchestrator(
  input: string,
): Promise<AssistantResponse> {
  /**
   * =============================
   * 1. Understand User
   * =============================
   */

  const intent = detectIntent(input);

  /**
   * =============================
   * 2. Load Knowledge
   * =============================
   */

  const projects = buildProjectContext();

  /**
   * =============================
   * 3. Find Relevant Project
   * =============================
   */

  const results = searchProjects(input, projects);

  const bestMatch = results[0];

  /**
   * =============================
   * 4. Confidence
   * =============================
   */

  const confidence = bestMatch ? calculateConfidence(bestMatch.score) : 0;

  /**
   * =============================
   * 5. Decide
   * =============================
   */

  const decision = makeDecision({
    intent,

    confidence,

    path: bestMatch ? `/project/${bestMatch.project.slug}` : undefined,
  });

  /**
   * =============================
   * 6. Create Plan
   * =============================
   */

  const plan = createPlan(decision);

  /**
   * =============================
   * 7. Execute
   * =============================
   */

  const execution = executePlan({
    plan,

    projectResult: bestMatch,
  });

  /**
   * =============================
   * 8. Build Final Response
   * =============================
   */

  return buildOrchestratorResponse({
    decision,

    execution,

    bestMatch,
  });
}
