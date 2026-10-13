import { addConversation } from "../memory/assistantMemory";

import { aiOrchestrator } from "../../../components/Ai/orchestrator/aiOrchestrator";

import type { AssistantResponse } from "./assistant.types";

export async function assistantEngine(
  input: string,
): Promise<AssistantResponse> {
  /**
   * ==========================
   * 1. Save User Message
   * ==========================
   */

  addConversation({
    role: "user",

    content: input,
  });

  /**
   * ==========================
   * 2. Give Control To Brain
   * ==========================
   */

  const response = await aiOrchestrator(input);

  /**
   * ==========================
   * 3. Save AI Response
   * ==========================
   */

  addConversation({
    role: "assistant",

    content: response.message,
  });

  /**
   * ==========================
   * 4. Return Result
   * ==========================
   */

  return response;
}
