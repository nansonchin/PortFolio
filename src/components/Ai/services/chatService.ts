import { getAIProvider } from "../provider/aiProvider";
import type { AiMessage, AiRequest, AiRequestContext } from "../provider/aiProvider.types";
import { executeTool, type ToolContext } from "../tools/toolHandlers";

const MAX_TOOL_ROUNDS = 4;
const MAX_USER_TURNS = 10;

let history: AiMessage[] = [];

function trimHistory(keepUserTurns=MAX_USER_TURNS) {
  const userIndexes = history
    .map((m, i) => (m.role === "user" ? i : -1))
    .filter((i) => i >= 0);
  if (userIndexes.length > keepUserTurns) {
    history = history.slice(userIndexes[userIndexes.length - keepUserTurns]);
  }
}

export function resetChat() {
  history = [];
}

export type AskJarvisOptions = {
  /** 文字生成过程中逐段回调（delta，不是累计值） */
  onTextDelta?: (delta: string) => void;
  /** 用来取消整个对话轮次（包括正在进行的流） */
  signal?: AbortSignal;
  getContext?:()=>AiRequestContext
};

/**
 * 工具调用循环依然是“一轮一轮”的：
 *   第 N 轮：流式接收文字 → 流结束（拿到完整的 toolCalls）→ 执行工具 → 进入第 N+1 轮
 *
 * 工具必须等这一轮的流结束后才能执行，因为 functionCall 的参数要完整才能用。
 * 所以如果模型说了一句“好的，带你去项目页”再调用 navigate，
 * 用户会先看到这句话一点点出现，然后页面才跳转。
 */
export async function askJarvis(
  input: string,
  ctx: ToolContext,
  { onTextDelta, signal, getContext }: AskJarvisOptions = {},
): Promise<string> {
  const provider = getAIProvider();
  trimHistory(MAX_USER_TURNS-1)
  const checkpoint = history.length;

  history.push({ role: "user", text: input });

  // 用户实际看到的完整文字（多轮的文字会拼在一起，轮与轮之间空一行）
  let displayed = "";
  let needsBreak = false;

  const emit = (delta: string) => {
    if (!delta) return;

    if (needsBreak) {
      displayed += "\n\n";
      onTextDelta?.("\n\n");
      needsBreak = false;
    }

    displayed += delta;
    onTextDelta?.(delta);
  };

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const res = await provider.generate(
        { messages: history },
        { onTextDelta: emit, signal },
      );

      history.push({ role: "model", text: res.text, raw: res.raw });

      if (res.toolCalls.length === 0) {
        trimHistory();
        return displayed || res.text || "…";
      }

      if (res.text.trim()) needsBreak = true;

      const results = res.toolCalls.map((call) => executeTool(call, ctx));

      history.push({ role: "tool", results });
    }

    return "Sorry, I got stuck on that one. Could you rephrase?";
  } catch (error) {
    // 失败 / 取消：回滚这一轮写进去的历史，避免留下半截对话
    history.length = checkpoint;
    throw error;
  }
}
