import { SYSTEM_PROMPT, TOOLS } from "./_generated.js";
import {
  clientKey,
  isAllowedOrigin,
  parseMessages,
  rateLimit,
  toGeminiContents,
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

type GeminiPart = {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
  functionCall?: { name: string; args?: Record<string, unknown> };
};

type ToolCall = { name: string; args: Record<string, unknown> };

/**
 * 浏览器 ⇄ 我们的 API 之间的事件协议（SSE，每个事件一行 `data: {json}`）
 *
 *  text   一段新增文字（delta，不是累计值）
 *  done   ★ 唯一的“成功结束”标记，带最终的 text / toolCalls / raw
 *  error  流开始之后才发生的错误（此时 HTTP 状态码已经是 200，只能用事件通知）
 */
type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "done"; text: string; toolCalls: ToolCall[]; raw: unknown }
  | { type: "error"; error: string };

function buildGenerationConfig(model: string, level: string) {
  if (!level || level === "default") {
    return undefined;
  }

  return { thinkingConfig: { thinkingLevel: level } };
}

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const HARD_TIMEOUT_MS = 60_000; // 整个请求的上限
const IDLE_TIMEOUT_MS = 25_000; // 上游多久没有任何数据就放弃（防止流“挂住”）
const DEFAULT_THINKING = "low";
const TOOL_NAMES = new Set(TOOLS.map((tool) => tool.name));

/**
 * 把流式 chunk 里零散的 parts 重新拼成一条完整的 model content。
 *
 * 这一步必须在服务端做，而且要小心：
 *  - 文字是一小段一小段来的 → 相邻的文字 part 要合并
 *  - functionCall 是完整的一个 part → 原样保留，不能合并
 *  - thoughtSignature 必须跟着它所属的 part 原样带回去，
 *    否则下一轮把历史发回 Gemini 时，多步 function calling 可能报错
 *  - thought 摘要 part（如果有）不是给用户看的 → 丢掉
 */
class ModelContentBuilder {
  private parts: GeminiPart[] = [];

  /** 返回这个 part 里需要立刻推给前端的文字（没有则返回空字符串） */
  add(part: GeminiPart): string {
    if (part.thought) return "";

    if (part.functionCall) {
      this.parts.push({
        functionCall: part.functionCall,
        ...(part.thoughtSignature
          ? { thoughtSignature: part.thoughtSignature }
          : {}),
      });
      return "";
    }

    if (typeof part.text === "string") {
      const last = this.parts[this.parts.length - 1];

      if (last && typeof last.text === "string" && !last.thoughtSignature) {
        last.text += part.text;
        if (part.thoughtSignature)
          last.thoughtSignature = part.thoughtSignature;
      } else {
        this.parts.push({
          text: part.text,
          ...(part.thoughtSignature
            ? { thoughtSignature: part.thoughtSignature }
            : {}),
        });
      }

      return part.text;
    }

    // 只有 signature、没有文字也没有 functionCall 的 part（常出现在最后一个 chunk）
    if (part.thoughtSignature) {
      const last = this.parts[this.parts.length - 1];

      if (last && !last.thoughtSignature) {
        last.thoughtSignature = part.thoughtSignature;
      } else {
        this.parts.push({ text: "", thoughtSignature: part.thoughtSignature });
      }
    }

    return "";
  }

  result() {
    if (this.parts.length === 0) return null;

    const text = this.parts.map((part) => part.text ?? "").join("");
    const toolCalls: ToolCall[] = this.parts.flatMap((part) =>
      part.functionCall
        ? [{ name: part.functionCall.name, args: part.functionCall.args ?? {} }]
        : [],
    );

    return { text, toolCalls, raw: { role: "model", parts: this.parts } };
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

  /* ───────── 1. 流开始之前：所有检查都用“真正的 HTTP 状态码”返回 ───────── */

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const isProduction = process.env.VERCEL_ENV === "production";

  if (
    !isAllowedOrigin(
      req.headers,
      isProduction,
      process.env.ALLOWED_ORIGINS ?? "",
    )
  ) {
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
    return res
      .status(429)
      .json({ error: "rate_limited", retryAfter: limit.retryAfter });
  }

  const parsed = parseMessages(req.body, TOOL_NAMES);

  if (!parsed.ok) {
    return res.status(400).json({ error: "bad_request", detail: parsed.error });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  const thinkingLevel = process.env.GEMINI_THINKING_LEVEL ?? DEFAULT_THINKING;

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

  // 注意是 res 的 close，不是 req 的：
  // Node 里 req 的 close 在“请求体读完”时就会触发，并不代表用户离开了。
  // 用户关掉标签页 / 点了取消 → 我们要马上停掉对 Gemini 的请求，省额度。
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
    const upstream = await fetch(
      `${ENDPOINT}/${model}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + buildStateBlock(req.body)}] },
          contents: toGeminiContents(parsed.messages),
          tools: [{ functionDeclarations: TOOLS }],
          generationConfig: buildGenerationConfig(model, thinkingLevel),
        }),
      },
    );

    // 还没开始流：这里的错误依然可以用正常状态码返回
    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      console.error(
        "[chat] upstream error",
        upstream.status,
        detail.slice(0, 500),
      );

      // 注意：前端 toErrorCode 是用 === "upstream_busy" 比较的，
      // 原来写成 "upstream_busy, Quote_Limit_Reached" 会永远匹配不上。
      if (upstream.status === 429)
        return res.status(503).json({ error: "upstream_busy" });

      return res.status(502).json({ error: "upstream_error" });
    }

    /* ───────── 3. 开始流 ───────── */

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-transform"); // no-transform：别让中间层压缩 / 缓冲
    res.setHeader("X-Accel-Buffering", "no"); // 告诉 nginx 类代理不要缓冲
    res.flushHeaders?.();

    const builder = new ModelContentBuilder();

    for await (const data of readSseData(upstream.body)) {
      armIdle();

      const chunk = safeJson(data);
      if (!chunk) continue;

      // Gemini 也可能在流中间报错
      if (chunk.error) {
        console.error(
          "[chat] mid-stream upstream error",
          JSON.stringify(chunk.error).slice(0, 500),
        );
        send({
          type: "error",
          error: chunk.error.code === 429 ? "upstream_busy" : "upstream_error",
        });
        return;
      }

      const parts: GeminiPart[] = chunk.candidates?.[0]?.content?.parts ?? [];

      for (const part of parts) {
        const delta = builder.add(part);

        if (delta) {
          firstTokenAt ??= Date.now();
          send({ type: "text", delta });
        }
      }
    }

    const result = builder.result();

    if (!result) {
      console.error("[chat] empty response");
      send({ type: "error", error: "empty_response" });
      return;
    }

    // 只有走到这里才算成功。前端看不到 done 就必须当作失败（被截断）。
    send({ type: "done", ...result });

    console.info("[chat] done", {
      model,
      thinkingLevel,
      ttfbMs: firstTokenAt ? firstTokenAt - startedAt : null, // 首字延迟：流式体验好不好看这个数字
      totalMs: Date.now() - startedAt,
      toolCalls: result.toolCalls.length,
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";

    console.error("[chat] failed", {
      model,
      thinkingLevel,
      ms: Date.now() - startedAt,
      abortReason,
      error,
    });

    if (abortReason === "client") return; // 用户已经走了，没人听

    const code = aborted ? "timeout" : "upstream_error";

    // 流已经开始 → 状态码改不了了，只能发事件
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
