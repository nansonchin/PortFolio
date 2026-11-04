import { getAIProvider } from "../provider/aiProvider";
import type { AiMessage, AiRequest, AiRequestContext, AiToolResult } from "../provider/aiProvider.types";
import { isAbortError } from "../provider/proxyProvider";
import { executeTool, type ToolContext } from "../tools/toolHandlers";

const MAX_TOOL_ROUNDS = 4;
// 免费档 TPM 很小，历史越长每次请求越贵；5 轮对“终端导航 + 问答”足够
const MAX_USER_TURNS = 5;

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

const hasCjk = (text: string) => /[\u4e00-\u9fff]/.test(text);

function describeAction({ response }: AiToolResult, zh: boolean): string | null {
  if (response.success !== true) return null;

  if ("details" in response) return null;

  const target =
    typeof response.opened === "string"
      ? response.opened
      : typeof response.navigatedTo === "string"
        ? response.navigatedTo
        : null;

  if (target) return zh ? `已打开 ${target}。` : `Opened ${target}.`;
  return zh ? "已完成。" : "Done.";
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
  const zh = hasCjk(input);

  history.push({ role: "user", text: input });

  // 用户实际看到的完整文字（多轮的文字会拼在一起，轮与轮之间空一行）
  let displayed = "";
  let needsBreak = false;
const completedActions: string[] = [];
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
        { messages: history, context:getContext?.() },
        { onTextDelta: emit, signal },
      );

      history.push({ role: "model", text: res.text, raw: res.raw });

      if (res.toolCalls.length === 0) {
        trimHistory();
        return displayed || res.text || "…";
      }

      if (res.text.trim()) needsBreak = true;

      const results = res.toolCalls.map((call) => executeTool(call, ctx));
      const roundActions = results.map((r) => describeAction(r, zh));

      for (const action of roundActions) {
        if (action) completedActions.push(action);
      }

      history.push({ role: "tool", results });

      /*
       * 省额度的关键：如果这一轮的工具全是“动作”且全部成功（导航 / 筛选 / 开链接），
       * 页面已经变了，就不再请求模型“确认”——那一轮要把整份 system prompt 再发一遍。
       * 直接用本地生成的确认语收尾。
       *
       * 仍然走第二轮的情况：有工具失败（需要模型解释并给替代方案），
       * 或有 get_project_details 这类只读工具（模型要拿结果回答）。
       */
      if (roundActions.every((action) => action !== null)) {
        // 模型这轮已经说了话（例如“好的，这就打开”）就不再重复追加确认语
        const confirmation = res.text.trim() ? "" : roundActions.join(" ");

        if (confirmation) {
          if (displayed) needsBreak = true;
          emit(confirmation);
        }

        // 收尾成一条 assistant 消息，保证历史是 assistant(tool_calls) → tool → assistant，
        // 下一轮 user 消息接在后面是个完整的、各家 API 都认的序列
        history.push({
          role: "model",
          text: confirmation || res.text.trim() || (zh ? "已完成。" : "Done."),
        });

        trimHistory();
        return displayed || confirmation;
      }
    }

    return "Sorry, I got stuck on that one. Could you rephrase?";
  } catch (error) {
      if (!isAbortError(error) && completedActions.length > 0) {
      console.warn("[jarvis] confirmation round failed after a successful action", error);
 
      // 如果那一轮已经流出了一部分文字，先隔一行再接
      if (displayed) needsBreak = true;
 
      const fallback = completedActions.join(" ");
      emit(fallback);
 
      // 保持历史完整：... → tool → model，下一轮对话才不会接在一个悬空的 tool 结果后面
      history.push({ role: "model", text: fallback });
      trimHistory();
 
      return displayed;
    }
 
    // 用户主动取消 / 动作还没发生就失败了：回滚这一轮写进去的历史，避免留下半截对话
    history.length = checkpoint;
    throw error;
  }
}