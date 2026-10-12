import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";

import type { AssistantIntent } from "../ai/assistant.types";

export type ConversationRole = "user" | "assistant";

export type ConversationMessage = {
  role: ConversationRole;

  content: string;
};

type AssistantMemory = {
  /**
   * Current project AI is focusing
   */
  currentProject?: ProjectAiContext;

  /**
   * Last detected intent
   */
  lastIntent?: AssistantIntent;

  /**
   * Last user action
   */
  lastAction?: {
    type: string;

    value?: string;
  };

  /**
   * Conversation history
   */
  conversation: ConversationMessage[];
};

let memory: AssistantMemory = {
  conversation: [],
};

export function getAssistantMemory() {
  return memory;
}

export function setCurrentProject(project: ProjectAiContext) {
  memory.currentProject = project;
}

export function setLastIntent(intent: AssistantIntent) {
  memory.lastIntent = intent;
}

export function setLastAction(action: { type: string; value?: string }) {
  memory.lastAction = action;
}

export function addConversation(message: ConversationMessage) {
  memory.conversation.push(message);
}

export function clearAssistantMemory() {
  memory = {
    conversation: [],
  };
}
