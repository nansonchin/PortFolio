export const LIMITS = {
  maxMessages: 40,
  maxUserChars: 500,
  maxModelTextChars: 4000,
  maxToolResults: 4,
  maxToolResponseChars: 3000,
  maxPartsPerMessage: 8,
  rateWindowMs: 60_000,
  rateMax: 15,
} as const;

type Json = Record<string, unknown>;
type Headers = Record<string, string | string[] | undefined>;

export type ChatMessage =
  | { role: "user"; text: string }
  | { role: "model"; text: string; raw: Json | null }
  | { role: "tool"; results: { name: string; response: Json }[] };

export type ParseResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}


export function isAllowedOrigin(headers: Headers, isProduction: boolean, extraHosts: string) {
  const origin = first(headers.origin);

  if (!origin) return true;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  if (originHost === first(headers.host)) return true;

  const extras = extraHosts
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (extras.includes(originHost)) return true;

  if (!isProduction && /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(originHost)) return true;

  return false;
}


const hits = new Map<string, number[]>();

export function clientKey(headers: Headers): string {
  const forwarded = first(headers["x-forwarded-for"])?.split(",")[0]?.trim();
  return first(headers["x-real-ip"]) || forwarded || "unknown";
}

export function rateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const windowStart = now - LIMITS.rateWindowMs;
  const recent = (hits.get(key) ?? []).filter((time) => time > windowStart);

  if (recent.length >= LIMITS.rateMax) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.ceil((recent[0] + LIMITS.rateWindowMs - now) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [storedKey, times] of hits) {
      if (times.every((time) => time <= windowStart)) hits.delete(storedKey);
    }
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * 前端回传的 raw 是“上一轮 Groq 返回的 assistant 消息”，不可信，逐字段重建：
 *  { role: "assistant", content: string, tool_calls?: [{ id, type: "function", function: { name, arguments } }] }
 * tool_calls 里的 id 必须原样带回去，后面的 tool 消息要靠它配对。
 */
function sanitizeAssistantMessage(raw: unknown, allowedTools: Set<string>): Json | null {
  if (!isRecord(raw) || raw.role !== "assistant") return null;
 
  const content =
    typeof raw.content === "string" ? raw.content.slice(0, LIMITS.maxModelTextChars) : "";
 
  const toolCalls: Json[] = [];
 
  if (Array.isArray(raw.tool_calls)) {
    if (raw.tool_calls.length > LIMITS.maxToolResults) return null;
 
    for (const call of raw.tool_calls) {
      if (!isRecord(call) || !isRecord(call.function)) return null;
 
      const { id } = call;
      const { name, arguments: args } = call.function;
 
      if (typeof id !== "string" || id.length === 0 || id.length > 200) return null;
      if (typeof name !== "string" || !allowedTools.has(name)) return null;
      if (typeof args !== "string" || args.length > 2000) return null;
 
      // arguments 必须是合法 JSON 对象字符串，否则 Groq 会直接 400
      try {
        const parsedArgs = JSON.parse(args);
        if (!isRecord(parsedArgs)) return null;
      } catch {
        return null;
      }
 
      toolCalls.push({ id, type: "function", function: { name, arguments: args } });
    }
  }
 
  if (content === "" && toolCalls.length === 0) return null;
 
  return { role: "assistant", content, ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}) };
}

export function parseMessages(body: unknown, allowedTools: Set<string>): ParseResult {
  if (!isRecord(body) || !Array.isArray(body.messages)) {
    return { ok: false, error: "messages must be an array" };
  }

  const input = body.messages;

  if (input.length === 0 || input.length > LIMITS.maxMessages) {
    return { ok: false, error: "invalid message count" };
  }

  const messages: ChatMessage[] = [];

  for (const item of input) {
    if (!isRecord(item)) return { ok: false, error: "invalid message" };

    if (item.role === "user") {
      const text = typeof item.text === "string" ? item.text.trim() : "";

      if (text === "" || text.length > LIMITS.maxUserChars) {
        return { ok: false, error: "invalid user text" };
      }

      messages.push({ role: "user", text });
      continue;
    }

    if (item.role === "model") {
      const text = typeof item.text === "string" ? item.text.slice(0, LIMITS.maxModelTextChars) : "";
      const raw = sanitizeAssistantMessage(item.raw, allowedTools);

      if (!raw && text === "") return { ok: false, error: "empty model message" };

      messages.push({ role: "model", text, raw });
      continue;
    }

    if (item.role === "tool") {
      const list = item.results;

      if (!Array.isArray(list) || list.length === 0 || list.length > LIMITS.maxToolResults) {
        return { ok: false, error: "invalid tool results" };
      }

      const results: { name: string; response: Json }[] = [];

      for (const result of list) {
        if (
          !isRecord(result) ||
          typeof result.name !== "string" ||
          !allowedTools.has(result.name) ||
          !isRecord(result.response) ||
          JSON.stringify(result.response).length > LIMITS.maxToolResponseChars
        ) {
          return { ok: false, error: "invalid tool result" };
        }

        results.push({ name: result.name, response: result.response });
      }

      messages.push({ role: "tool", results });
      continue;
    }

    return { ok: false, error: "unknown role" };
  }

  if (messages[0].role !== "user") {
    return { ok: false, error: "conversation must start with a user message" };
  }

  if (messages[messages.length - 1].role === "model") {
    return { ok: false, error: "conversation must end with a user or tool message" };
  }

  return { ok: true, messages };
}

type PendingCall = { id: string; name: string };

export function toGroqMessages(messages: ChatMessage[], systemPrompt: string) {
  const out: Json[] = [{ role: "system", content: systemPrompt }];
  let pending: PendingCall[] = [];
 
  for (const message of messages) {
    if (message.role === "user") {
      pending = [];
      out.push({ role: "user", content: message.text });
      continue;
    }
 
    if (message.role === "model") {
      const assistant = message.raw ?? { role: "assistant", content: message.text };
      out.push(assistant);
 
      const calls = Array.isArray(assistant.tool_calls) ? (assistant.tool_calls as Json[]) : [];
      pending = calls.map((call) => ({
        id: String(call.id),
        name: String((call.function as Json).name),
      }));
      continue;
    }
 
    // role === "tool"：每个 tool_call 必须恰好有一条 tool 消息，少一条 Groq 就 400
    const unused = [...message.results];
 
    for (const call of pending) {
      const index = unused.findIndex((result) => result.name === call.name);
      const result = index >= 0 ? unused.splice(index, 1)[0] : null;
 
      out.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result?.response ?? { success: false, error: "no result" }),
      });
    }
 
    pending = [];
  }
 
  return out;
}