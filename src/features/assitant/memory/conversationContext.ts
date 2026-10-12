import { getAssistantMemory } from "./assistantMemory";

export function getConversationHistory() {
  const memory = getAssistantMemory();

  return memory.conversation;
}

export function getRecentConversation(limit: number = 5) {
  const history = getConversationHistory();

  return history.slice(-limit);
}
