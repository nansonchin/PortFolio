
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildSystemPrompt } from "../src/components/Ai/prompt/buildSystemPrompt.ts";
import { buildPortfolioContext } from "../src/components/Ai/index.ts";
import { portfolioTools } from "../src/components/Ai/tools/toolDeclarations.ts";
const output = resolve(process.cwd(), "api/_generated.ts");
const checkOnly = process.argv.includes("--check");

const normalize = (text: string) => text.replace(/\r\n/g, "\n");

const systemPrompt = buildSystemPrompt(buildPortfolioContext());

const content = `// Auto-generated. Do not edit manually.
// Source: scripts/generate-server-data.ts (reads data and tool definitions from src)
// After modifying project data, run npm run gen:server and commit this file as well.

export const SYSTEM_PROMPT = ${JSON.stringify(systemPrompt)};

export const TOOLS = ${JSON.stringify(portfolioTools, null, 2)};
`;

if (checkOnly) {
  const current = existsSync(output) ? normalize(readFileSync(output, "utf8")) : "";

  if (current !== normalize(content)) {
    console.error("[generate] api/_generated.ts is out of date.");
    console.error("[generate] Please run npm run gen:server and commit the updated file.");
    process.exit(1);
  }

} else {
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, content, "utf8");

}



