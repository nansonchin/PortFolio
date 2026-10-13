import { setAiProvider } from "./aiProvider";
import { GeminiProvider } from "./geminiProvider";

export function setupAI() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const model = import.meta.env.VITE_GEMINI_MODEL;
  
  if (!apiKey) throw new Error("Gemini API Key Missing");

  setAiProvider(new GeminiProvider(apiKey, model || undefined));
}