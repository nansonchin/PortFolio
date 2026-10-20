import type { AiProvider, AiRequest, AiResponse } from "./aiProvider.types";


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

export class ProxyProvider implements AiProvider {
  private endpoint: string;

  constructor(endpoint: string = "/api/chat") {
    this.endpoint = endpoint;
  }

  async generate({ messages }: AiRequest): Promise<AiResponse> {

    let response: Response;

    try {
      response = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
    } catch {
      throw new ProxyError("unavailable", 0);
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new ProxyError(toErrorCode(response.status, body?.error), response.status);
    }

    const data = (await response.json()) as AiResponse;

    return { text: data.text ?? "", toolCalls: data.toolCalls ?? [], raw: data.raw };
  }
}