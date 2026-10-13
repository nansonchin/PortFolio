import type {
  AiCompletionRequest,
  AiCompletionResponse,
  AiProvider,
} from "./aiProvider.types";

export class GeminiProvider implements AiProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generate(request: AiCompletionRequest): Promise<AiCompletionResponse> {
    const systemPrompt = request.messages
      .filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n");

    const conversation = request.messages
      .filter((message) => message.role !== "system")
      .map((message) => {
        return `${message.role}:

${message.content}`;
      })
      .join("\n");

    const finalPrompt = `

${systemPrompt}


========================


${conversation}


`;

    console.log("Gemini Prompt:", finalPrompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${this.apiKey}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",

              parts: [
                {
                  text: finalPrompt,
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();

      throw new Error(error);
    }

    const data = await response.json();

    return {
      content: data.candidates[0].content.parts[0].text,
    };
  }
}
