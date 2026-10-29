import type { IncomingMessage, ServerResponse } from "node:http";
import { loadEnv, type Plugin } from "vite";

type ApiRequest = IncomingMessage & { body?: unknown };
type ApiResponse = ServerResponse & {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) chunks.push(chunk as Buffer);

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return undefined;

  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function apiDevPlugin(): Plugin {
  return {
    name: "api-dev",
    apply: "serve",

    configureServer(server) {
      const env = loadEnv(
        server.config.mode,
        server.config.envDir || process.cwd(),
        "",
      );

      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value;
      }

      server.middlewares.use("/api/chat", async (incoming, outgoing) => {
        const req = incoming as ApiRequest;
        const res = outgoing as ApiResponse;

        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (body) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        try {
          req.body = await readJson(req);

          const module = await server.ssrLoadModule("/api/chat.ts");
          await module.default(req, res);
        } catch (error) {
          console.error("[api-dev]", error);

          if (!res.headersSent)
            res.status(500).json({ error: "dev_server_error" });
          else if (!res.writableEnded) res.end();
        }
      });
    },
  };
}
