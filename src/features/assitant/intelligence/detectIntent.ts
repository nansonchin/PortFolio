import type { AssistantIntent } from "../ai/assistant.types";

export function detectIntent(input: string): AssistantIntent {
  const message = input.toLowerCase();

  /**
   * Architecture
   */
  if (
    message.includes("architecture") ||
    message.includes("structure") ||
    message.includes("system design")
  ) {
    return "architecture";
  }

  /**
   * Project information
   */
  if (
    message.includes("tell me") ||
    message.includes("about") ||
    message.includes("explain") ||
    message.includes("what is")
  ) {
    return "project_info";
  }

  /**
   * Navigation
   */
  if (
    message.includes("open") ||
    message.includes("visit") ||
    message.includes("go") ||
    message.includes("show me")
  ) {
    return "navigate";
  }

  return "general";
}
