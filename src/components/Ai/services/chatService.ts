import { getAIProvider } from "../provider/aiProvider";
import type { AiMessage } from "../provider/aiProvider.types";
import { buildPortfolioContext } from "../context/buildPortfolioContextMapper";
import { buildSystemPrompt } from "../prompt/buildSystemPrompt";
import { portfolioTools } from "../tools/toolDeclarations";
import { executeTool, type ToolContext } from "../tools/toolHandlers";

const MAX_TOOL_ROUNDS = 4;
const MAX_USER_TURNS = 10;

let history: AiMessage[] = [];

function trimHistory() {
  const userIndexes = history
    .map((m, i) => (m.role === "user" ? i : -1))
    .filter((i) => i >= 0);
  if (userIndexes.length > MAX_USER_TURNS) {
    history = history.slice(userIndexes[userIndexes.length - MAX_USER_TURNS]);
  }
}

export function resetChat() {
  history = [];
}

export async function askJarvis(
  input: string,
  ctx:  ToolContext,
): Promise<string> {
  const provider = getAIProvider();
  const systemPrompt = buildSystemPrompt(buildPortfolioContext());
  const checkpoint = history.length;

  history.push({ role: "user", text: input });

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const res = await provider.generate({
        systemPrompt,
        messages: history,
        tools: portfolioTools,
      });

      history.push({ role: "model", text: res.text, raw: res.raw });

      if (res.toolCalls.length === 0) {
        trimHistory();
        return res.text || "…";
      }

      history.push({
        role: "tool",
        results: res.toolCalls.map((call) => executeTool(call, ctx)),
      });
    }
    return "Sorry, I got stuck on that one. Could you rephrase?";
  } catch (error) {
    history.length = checkpoint;
    throw error;
  }
}