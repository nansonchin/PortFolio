import type { AssistantResponse } from "./assistant.types";
import { assistantEngine } from "./assistantEngine";


export async function runAssistant(input: string): Promise<AssistantResponse> {
  return assistantEngine(input);
}
