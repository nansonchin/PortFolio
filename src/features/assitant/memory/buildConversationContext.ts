import { getAssistantMemory } from "../memory/assistantMemory";

import { getRecentConversation } from "../memory/conversationContext";

export function buildConversationContext() {
  const memory = getAssistantMemory();

  return {
    currentProject: memory.currentProject
      ? {
          id: memory.currentProject.id,

          title: memory.currentProject.title,
        }
      : null,

    lastIntent: memory.lastIntent ?? null,

    lastAction: memory.lastAction ?? null,

    conversation: getRecentConversation(5),
  };
}
