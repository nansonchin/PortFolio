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

  export type AiRequestContext = {
  /** 访客此刻所在的页面，例如 "/about" 或 "/projects?category=Frontend" */
  path: string;
};

export type AiRequest = {
  messages: AiMessage[];
  context?: AiRequestContext;
};

export type AiResponse = {
  text: string;
  toolCalls: AiToolCall[];
  raw: unknown;
};

/**
 * 可选项：不传就和以前完全一样（等整段回复）。
 * 传了 onTextDelta 就会在文字生成的过程中逐段回调。
 * 返回值依然是完整的 AiResponse —— 调用方的工具调用循环不用改。
 */
export type AiGenerateOptions = {
  onTextDelta?: (delta: string) => void;
  signal?: AbortSignal;
};

export interface AiProvider {
  generate(request: AiRequest, options?: AiGenerateOptions): Promise<AiResponse>;
}