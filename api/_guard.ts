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


function sanitizeModelContent(raw: unknown, allowedTools: Set<string>): Json | null {
  if (!isRecord(raw) || !Array.isArray(raw.parts)) return null;
  if (raw.parts.length > LIMITS.maxPartsPerMessage) return null;

  const parts: Json[] = [];

  for (const part of raw.parts) {
    if (!isRecord(part)) continue;

    const clean: Json = {};

    if (typeof part.text === "string") {
      clean.text = part.text.slice(0, LIMITS.maxModelTextChars);
    }

    const call = part.functionCall;
    if (isRecord(call) && typeof call.name === "string" && allowedTools.has(call.name)) {
      const args = isRecord(call.args) ? call.args : {};

      if (JSON.stringify(args).length <= 2000) {
        clean.functionCall = {
          name: call.name,
          args,
          ...(typeof call.id === "string" && call.id.length <= 200 ? { id: call.id } : {}),
        };
      }
    }

    if (typeof part.thoughtSignature === "string" && part.thoughtSignature.length <= 8000) {
      clean.thoughtSignature = part.thoughtSignature;
    }

    if (Object.keys(clean).length > 0) parts.push(clean);
  }

  return parts.length > 0 ? { role: "model", parts } : null;
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
      const raw = sanitizeModelContent(item.raw, allowedTools);

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

export function toGeminiContents(messages: ChatMessage[]) {
  return messages.map((message) => {
    if (message.role === "user") {
      return { role: "user", parts: [{ text: message.text }] };
    }

    if (message.role === "model") {
      return message.raw ?? { role: "model", parts: [{ text: message.text }] };
    }

    return {
      role: "user",
      parts: message.results.map((result) => ({
        functionResponse: { name: result.name, response: result.response },
      })),
    };
  });
}