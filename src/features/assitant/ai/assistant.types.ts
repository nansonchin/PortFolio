export type AssistantIntent =
  | "navigate"
  | "project_info"
  | "general"
  | "architecture"
  | "developer_info";

export type AssistantAction = {
  type: "navigate";

  path: string;
};

export type AssistantResponse = {
  /**
   * AI answer text
   */
  message: string;

  /**
   * What user wanted
   */
  intent: AssistantIntent;

  /**
   * Did our internal AI solve it?
   *
   * true:
   *   no Gemini needed
   *
   * false:
   *   send to Gemini
   */
  handled: boolean;

  /**
   * Action for frontend
   */
  action?: AssistantAction;
};
