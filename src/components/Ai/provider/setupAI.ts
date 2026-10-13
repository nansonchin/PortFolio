
import { setAiProvider } from "./aiProvider";
import { GeminiProvider } from "./geminiProvider";

export function setupAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key missing");
  }

  const geminiProvider = new GeminiProvider(apiKey);

  setAiProvider(geminiProvider);
}
