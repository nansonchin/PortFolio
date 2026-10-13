export type AiToolDeclaration = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<
      string,
      { type: string; description: string; enum?: string[] }
    >;
    required?: string[];
  };
};

export type AiToolCall = { name: string; args: Record<string, unknown> };
export type AiToolResult = { name: string; response: Record<string, unknown> };

export type AiMessage =
  | { role: "user"; text: string }
  | { role: "model"; text: string; raw?: unknown }
  | { role: "tool"; results: AiToolResult[] };

export type AiRequest = {
  systemPrompt: string;
  messages: AiMessage[];
  tools?: AiToolDeclaration[];
};

export type AiResponse = {
  text: string;
  toolCalls: AiToolCall[];
  raw: unknown; 
};

export interface AiProvider {
  generate(request: AiRequest): Promise<AiResponse>;
}
