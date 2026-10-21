import { start } from "node:repl";
import { SYSTEM_PROMPT, TOOLS } from "./_generated.js";
import {
  clientKey,
  isAllowedOrigin,
  parseMessages,
  rateLimit,
  toGeminiContents,
} from "./_guard.js";
import { stat } from "node:fs";

type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type GeminiPart = {
  text?: string;
  functionCall?: { name: string; args?: Record<string, unknown> };
};

function buildGenerationConfig(model:string,level:string){
  if(!level || level ==="default"){
    return undefined;
  }

  return {thinkingConfig:{thinkingLevel:level}}
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const TIMEOUT_MS = 60_000;
const DEFAULT_THINKING = "low";
const TOOL_NAMES = new Set(TOOLS.map((tool) => tool.name));

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isAllowedOrigin(req.headers, isProduction, process.env.ALLOWED_ORIGINS ?? "")) {
    return res.status(403).json({ error: "forbidden" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set");
    return res.status(500).json({ error: "server_misconfigured" });
  }

  const limit = rateLimit(clientKey(req.headers));

  if (!limit.ok) {
    res.setHeader("Retry-After", String(limit.retryAfter));
    return res.status(429).json({ error: "rate_limited", retryAfter: limit.retryAfter });
  }

  const parsed = parseMessages(req.body, TOOL_NAMES);

  if (!parsed.ok) {
    return res.status(400).json({ error: "bad_request", detail: parsed.error });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const thinkingLevel=process.env.GEMINI_THINKING_LEVEL ?? DEFAULT_THINKING
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const startAt = Date.now()
  try {
    const upstream = await fetch(`${ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: toGeminiContents(parsed.messages),
        tools: [{ functionDeclarations: TOOLS }],
        generationConfig:buildGenerationConfig(model,thinkingLevel)
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("[chat] upstream error", upstream.status, detail.slice(0, 500));

      if (upstream.status === 429) return res.status(503).json({ error: "upstream_busy, Quote_Limit_Reached" });

      return res.status(502).json({ error: "upstream_error" });
    }

    const data:any = await upstream.json();
    const content = data.candidates?.[0]?.content;
    const parts: GeminiPart[] = content?.parts ?? [];

    if (parts.length === 0) {
      console.error("[chat] empty response", JSON.stringify(data.promptFeedback ?? null));
      return res.status(502).json({ error: "empty_response" });
    }

    const text = parts
      .filter((part) => typeof part.text === "string")
      .map((part) => part.text)
      .join("");
    
      const ms = Date.now()-startAt;

    const toolCalls = parts.flatMap((part) =>
      part.functionCall
        ? [{ name: part.functionCall.name, args: part.functionCall.args ?? {} }]
        : [],
    );

    res.setHeader("Server-Timing",`gemini;dur=${ms}`)

    return res.status(200).json({ text, toolCalls, raw: content });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error("[chat] failed", {
      model,
      thinkingLevel,
      ms:Date.now()-startAt,
      aborted,
      error,
    });

    return res
      .status(aborted ? 504 : 502)
      .json({ error: aborted ? "timeout" : "upstream_error" });
  } finally {
    clearTimeout(timer);
  }
}