import type { AiProvider } from "./aiProvider.types";

let provider: AiProvider | null = null;

export function setAiProvider(aiProvider: AiProvider) {
  provider = aiProvider;
}

export function getAIProvider() {
  if (!provider) {
    throw new Error("AI Provider not initialized");
  }

  return provider;
}
