import type {
  AiGenerateOptions,
  AiProvider,
  AiRequest,
  AiResponse,
} from "./aiProvider.types";
import { readSseData } from "./sse";

export type ProxyErrorCode =
  | "rate_limited"
  | "busy"
  | "timeout"
  | "bad_request"
  | "unavailable";

const USER_MESSAGES: Record<ProxyErrorCode, string> = {
  rate_limited: "Too many requests. Please wait a moment and try again.",
  busy: "JARVIS is busy right now. Please try again in a little while.",
  timeout: "JARVIS took too long to answer. Please try again.",
  bad_request: "That message couldn't be processed. Try a shorter question.",
  unavailable: "JARVIS is unavailable right now. Try a command like: projects",
};

export class ProxyError extends Error {
  code: ProxyErrorCode;

  constructor(code: ProxyErrorCode, status: number) {
    super(`Proxy ${status}: ${code}`);
    this.name = "ProxyError";
    this.code = code;
  }

  get userMessage() {
    return USER_MESSAGES[this.code];
  }
}

function toErrorCode(status: number, error?: string): ProxyErrorCode {
  if (status === 429 || error === "rate_limited") return "rate_limited";
  if (error === "upstream_busy") return "busy";
  if (status === 504 || error === "timeout") return "timeout";
  if (status === 400) return "bad_request";
  return "unavailable";
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

/** 服务端 → 浏览器的事件（和 api/chat.ts 里的 StreamEvent 一一对应） */
type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "done"; text: string; toolCalls: AiResponse["toolCalls"]; raw: unknown }
  | { type: "error"; error: string };

function parseEvent(data: string): StreamEvent | null {
  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    return null; // 单个坏事件不应该让整条回复失败
  }
}

export class ProxyProvider implements AiProvider {
  private endpoint: string;

  constructor(endpoint: string = "/api/chat") {
    this.endpoint = endpoint;
  }

  async generate(
    { messages, context }: AiRequest,
    { onTextDelta, signal }: AiGenerateOptions = {},
  ): Promise<AiResponse> {
    let response: Response;

    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, context }),
        signal,
      });
    } catch (error) {
      if (isAbortError(error)) throw error; // 用户主动取消：不是“服务不可用”
      throw new ProxyError("unavailable", 0);
    }

    // 流开始之前的错误：服务端用的是正常 HTTP 状态码 + JSON
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new ProxyError(toErrorCode(response.status, body?.error), response.status);
    }

    // 降级：如果中间某一层没有走流式（返回的是普通 JSON），照旧能用
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/event-stream") || !response.body) {
      const data = (await response.json()) as AiResponse;
      if (data.text) onTextDelta?.(data.text);
      return { text: data.text ?? "", toolCalls: data.toolCalls ?? [], raw: data.raw };
    }

    return this.readStream(response.body, onTextDelta);
  }

  private async readStream(
    body: ReadableStream<Uint8Array>,
    onTextDelta?: (delta: string) => void,
  ): Promise<AiResponse> {
    let result: AiResponse | null = null;

    try {
      for await (const data of readSseData(body)) {
        const event = parseEvent(data);
        if (!event) continue;

        if (event.type === "text") {
          onTextDelta?.(event.delta);
        } else if (event.type === "done") {
          result = {
            text: event.text ?? "",
            toolCalls: event.toolCalls ?? [],
            raw: event.raw,
          };
        } else if (event.type === "error") {
          throw new ProxyError(toErrorCode(0, event.error), 0);
        }
      }
    } catch (error) {
      if (error instanceof ProxyError || isAbortError(error)) throw error;
      throw new ProxyError("unavailable", 0); // 流读到一半网络断了
    }

    // ★ 关键：连接正常关闭 ≠ 成功。没有收到 done，说明回复被截断了。
    if (!result) throw new ProxyError("unavailable", 0);

    return result;
  }
}