import { buildPortfolioPrompt } from "../prompt/buildPortfolioPrompt";

import { getAIProvider } from "../provider/aiProvider";

import { buildPortfolioContext } from "../context/buildPortfolioContextMapper";

export async function askPortfolioAI(input: string) {
  /**
   * ==============================
   *
   * Step 1
   *
   * Build Portfolio Knowledge
   *
   * ==============================
   */

  const context = buildPortfolioContext();

  /**
   * ==============================
   *
   * Step 2
   *
   * Convert Knowledge
   * into AI Prompt
   *
   * ==============================
   */

  const systemPrompt = buildPortfolioPrompt(context);

  /**
   * ==============================
   *
   * Step 3
   *
   * Call Gemini
   *
   * ==============================
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

  return response.content;
}
