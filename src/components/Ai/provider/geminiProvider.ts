import type {
  AiMessage,
  AiProvider,
  AiRequest,
  AiResponse,
} from "./aiProvider.types";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

function toGeminiContent(message: AiMessage) {
  switch (message.role) {
    case "user":
      return { role: "user", parts: [{ text: message.text }] };
    case "model":
      return message.raw ?? { role: "model", parts: [{ text: message.text }] };
    case "tool":
      return {
        role: "user",
        parts: message.results.map((r) => ({
          functionResponse: { name: r.name, response: r.response },
        })),
      };
  }
}

export class GeminiProvider implements AiProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "gemini-flash-lite-latest") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate({
    systemPrompt,
    messages,
    tools,
  }: AiRequest): Promise<AiResponse> {
    const response = await fetch(`${ENDPOINT}/${this.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: messages.map(toGeminiContent),
        tools: tools?.length ? [{ functionDeclarations: tools }] : undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content;
    const parts: any[] = content?.parts ?? [];

    return {
      text: parts
        .filter((p) => p.text)
        .map((p) => p.text)
        .join(""),
      toolCalls: parts
        .filter((p) => p.functionCall)
        .map((p) => ({
          name: p.functionCall.name,
          args: p.functionCall.args ?? {},
        })),
      raw: content,
    };
  }
}
