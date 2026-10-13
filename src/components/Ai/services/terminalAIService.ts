import type { AssistantResponse } from "../../../features/assitant/ai/assistant.types";

import { getAIProvider } from "../provider/aiProvider";

import { buildPortfolioPrompt } from "../prompt/buildPortfolioPrompt";
import { buildPortfolioContext } from "../context/buildPortfolioContextMapper";

export async function askTerminalAI(input: string): Promise<AssistantResponse> {
  /**
   * =================================
   *
   * Step 1
   *
   * Build Portfolio Knowledge
   *
   * =================================
   */

  const context = buildPortfolioContext();
 
  const systemPrompt = buildPortfolioPrompt(context);

  /**
   * =================================
   *
   * Step 2
   *
   * Ask Gemini
   *
   * =================================
   */

  const provider = getAIProvider();

  const response = await provider.generate({
    messages: [
      {
        role: "system",

        content: systemPrompt,
      },

      {
        role: "user",

        content: input,
      },
    ],
  });

  /**
   * =================================
   *
   * Step 3
   *
   * Convert Gemini Response
   *
   * =================================
   */

  return {
    intent: "general",

    handled: true,

    message: response.content,
  };
}
