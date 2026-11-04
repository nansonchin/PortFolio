import { SYSTEM_PROMPT, TOOLS } from "./_generated.js";
import {
  clientKey,
  isAllowedOrigin,
  parseMessages,
  rateLimit,
  toGroqMessages,
} from "./_guard.js";
import { readSseData } from "./_sse.js";

type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  write: (chunk: string) => boolean;
  end: () => void;
  flushHeaders?: () => void;
  on: (event: "close", listener: () => void) => void;
  statusCode: number;
  readonly headersSent: boolean;
  readonly writableEnded: boolean;
};

type ToolCall = { name: string; args: Record<string, unknown> };

/** Groq（OpenAI 兼容）流式 chunk 里 choices[0].delta 的形状 */
type GroqDelta = {
  content?: string | null;
  tool_calls?: {
    index?: number;
    id?: string;
    function?: { name?: string; arguments?: string };
  }[];
};

/**
 * 浏览器 ⇄ 我们的 API 之间的事件协议——和 Gemini 版完全一样，前端一行都不用改：
 *  text   一段新增文字（delta）
 *  done   唯一的“成功结束”标记，带最终的 text / toolCalls / raw
 *  error  流开始之后才发生的错误
 */
type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "done"; text: string; toolCalls: ToolCall[]; raw: unknown }
  | { type: "error"; error: string };

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "qwen/qwen3.8-27b";
const HARD_TIMEOUT_MS = 60_000;
const IDLE_TIMEOUT_MS = 25_000;

// Qwen3.8 有 thinking / instruct 两种模式：
//  "none" = instruct（快、省 token，适合这种导航 + 问答的小终端）
//  "low" | "medium" | "high" | "default" = thinking（会多吃很多输出 token）
const DEFAULT_REASONING = "none";

// 免费档 TPM 只有 8K，限制输出长度能省额度（终端里本来也只要几句话）
const MAX_OUTPUT_TOKENS = 800;

const TOOL_NAMES = new Set(TOOLS.map((tool) => tool.name));

/** 我们的 TOOLS 声明 → OpenAI 的 tools 格式（多包一层 type/function） */
const GROQ_TOOLS = TOOLS.map((tool) => ({
  type: "function" as const,
  function: {
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  },
}));

/**
 * 把流式 chunk 拼回一条完整的 assistant 消息。
 *
 *  - 文字：content 一小段一小段来 → 累加，同时把这一段立刻推给前端
 *  - 工具调用：和 Gemini 不一样！Gemini 的 functionCall 是整块来的，
 *    OpenAI 格式里 tool_calls 是“碎片”：同一个 index 的 id/name 先到，
 *    arguments 是一个被切成很多段的 JSON 字符串，要自己按 index 拼接，
 *    流结束后才能 JSON.parse。
 */
class AssistantBuilder {
  private text = "";
  private calls = new Map<number, { id: string; name: string; args: string }>();

  /** 返回需要立刻推给前端的文字（没有则返回空字符串） */
  add(delta: GroqDelta): string {
    for (const piece of delta.tool_calls ?? []) {
      const index = typeof piece.index === "number" ? piece.index : 0;
      const current = this.calls.get(index) ?? { id: "", name: "", args: "" };

      if (piece.id) current.id = piece.id;
      if (piece.function?.name) current.name = piece.function.name;
      if (typeof piece.function?.arguments === "string") {
        current.args += piece.function.arguments;
      }

      this.calls.set(index, current);
    }

    if (typeof delta.content === "string" && delta.content !== "") {
      this.text += delta.content;
      return delta.content;
    }

    return "";
  }

  result() {
    const toolCalls: ToolCall[] = [];
    const rawCalls: {
      id: string;
      type: "function";
      function: { name: string; arguments: string };
    }[] = [];

    [...this.calls.entries()]
      .sort(([a], [b]) => a - b)
      .forEach(([index, call]) => {
        if (!TOOL_NAMES.has(call.name)) return; // 模型编了个不存在的工具 → 丢掉

        const parsed = safeJson(call.args || "{}");
        const args =
          parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? (parsed as Record<string, unknown>)
            : {};

        toolCalls.push({ name: call.name, args });
        rawCalls.push({
          id: call.id || `call_${index}_${Date.now()}`,
          type: "function",
          // 存回去的 arguments 用“重新序列化后的合法 JSON”，避免模型吐出半截 JSON 毒害后续轮次
          function: { name: call.name, arguments: JSON.stringify(args) },
        });
      });

    if (this.text === "" && toolCalls.length === 0) return null;

    return {
      text: this.text,
      toolCalls,
      raw: {
        role: "assistant",
        content: this.text,
        ...(rawCalls.length > 0 ? { tool_calls: rawCalls } : {}),
      },
    };
  }
}

function buildStateBlock(body: unknown): string {
  const path = (body as { context?: { path?: unknown } } | null)?.context?.path;

  if (typeof path !== "string" || path.length > 200) return "";
  if (!/^\/[\w\-./?=&%+]*$/.test(path)) return "";

  return `\n\n# Current state\nThe visitor is currently viewing this page of the portfolio: ${path}`;
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");

  /* ───────── 1. 流开始之前：所有检查都用真正的 HTTP 状态码返回 ───────── */

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isAllowedOrigin(req.headers, isProduction, process.env.ALLOWED_ORIGINS ?? "")) {
    return res.status(403).json({ error: "forbidden" });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("[chat] GROQ_API_KEY is not set");
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

  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;
  const reasoningEffort = process.env.GROQ_REASONING_EFFORT ?? DEFAULT_REASONING;

  /* ───────── 2. 取消与超时 ───────── */

  const controller = new AbortController();
  let abortReason: "timeout" | "client" | null = null;

  const abort = (reason: "timeout" | "client") => {
    abortReason ??= reason;
    controller.abort();
  };

  const hardTimer = setTimeout(() => abort("timeout"), HARD_TIMEOUT_MS);
  let idleTimer: ReturnType<typeof setTimeout> | undefined;
  const armIdle = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => abort("timeout"), IDLE_TIMEOUT_MS);
  };

  // 是 res 的 close，不是 req 的（req 的 close 在请求体读完时就触发了）
  res.on("close", () => {
    if (!res.writableEnded) abort("client");
  });

  const send = (event: StreamEvent) => {
    if (res.writableEnded || abortReason === "client") return;
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  const startedAt = Date.now();
  let firstTokenAt: number | null = null;

  armIdle();

  try {
    const upstream = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Gemini 是 x-goog-api-key，Groq 是标准 Bearer
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: true,
        messages: toGroqMessages(parsed.messages, SYSTEM_PROMPT + buildStateBlock(req.body)),
        tools: GROQ_TOOLS,
        tool_choice: "auto",
        temperature: 0.7,
        max_completion_tokens: MAX_OUTPUT_TOKENS,
        ...(reasoningEffort && reasoningEffort !== "unset"
          ? { reasoning_effort: reasoningEffort }
          : {}),
      }),
    });

    // 还没开始流：这里的错误依然可以用正常状态码返回
    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      console.error("[chat] upstream error", upstream.status, detail.slice(0, 500));

      // 429 = 触发了 RPM/RPD/TPM/TPD 之一；
      // 413 = 单个请求本身就超过了 TPM 上限（免费档 8K，prompt 太长时会遇到）
      if (upstream.status === 429 || upstream.status === 413) {
        return res.status(503).json({ error: "upstream_busy" });
      }

      return res.status(502).json({ error: "upstream_error" });
    }

    /* ───────── 3. 开始流 ───────── */

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();

    const builder = new AssistantBuilder();

    for await (const data of readSseData(upstream.body)) {
      armIdle();

      // OpenAI 格式的流以 `data: [DONE]` 结束（Gemini 没有这个）
      if (data === "[DONE]") break;

      const chunk = safeJson(data);
      if (!chunk) continue;

      if (chunk.error) {
        console.error("[chat] mid-stream upstream error", JSON.stringify(chunk.error).slice(0, 500));
        send({
          type: "error",
          error:
            chunk.error.code === 429 || chunk.error.type === "rate_limit_exceeded"
              ? "upstream_busy"
              : "upstream_error",
        });
        return;
      }

      const delta: GroqDelta = chunk.choices?.[0]?.delta ?? {};
      const text = builder.add(delta);

      if (text) {
        firstTokenAt ??= Date.now();
        send({ type: "text", delta: text });
      }
    }

    const result = builder.result();

    if (!result) {
      console.error("[chat] empty response");
      send({ type: "error", error: "empty_response" });
      return;
    }

    send({ type: "done", ...result });

    console.info("[chat] done", {
      model,
      reasoningEffort,
      ttfbMs: firstTokenAt ? firstTokenAt - startedAt : null,
      totalMs: Date.now() - startedAt,
      toolCalls: result.toolCalls.length,
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";

    console.error("[chat] failed", {
      model,
      reasoningEffort,
      ms: Date.now() - startedAt,
      abortReason,
      error,
    });

    if (abortReason === "client") return;

    const code = aborted ? "timeout" : "upstream_error";

    if (res.headersSent) {
      send({ type: "error", error: code });
      return;
    }

    return res.status(aborted ? 504 : 502).json({ error: code });
  } finally {
    clearTimeout(hardTimer);
    clearTimeout(idleTimer);

    if (res.headersSent && !res.writableEnded) res.end();
  }
}