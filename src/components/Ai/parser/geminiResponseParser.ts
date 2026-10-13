import type { AssistantIntent } from "../../../features/assitant/ai/assistant.types";

export type GeminiIntentResponse = {
  intent: AssistantIntent;

  project?: string;

  message: string;
};

export function parseGeminiResponse(content: string): GeminiIntentResponse {
  try {
    /**
     * Gemini should return JSON
     */

    const json = JSON.parse(content);

    return {
      intent: json.intent ?? "general",

      project: json.project,

      message: json.message ?? "",
    };
  } catch (error) {
    /**
     * fallback
     */

    return {
      intent: "general",

      message: content,
    };
  }
}
