/**
 * 浏览器端的 SSE 解析。
 *
 * 为什么不用 EventSource？因为 EventSource 只能发 GET，
 * 而我们要 POST 一整段对话历史，所以只能 fetch + ReadableStream 自己读。
 *
 * （和 api/_sse.ts 逻辑相同；api 和 src 是两个独立的构建目标，
 *  各放一份比硬凑一个跨目录共享模块更省事。）
 */
export async function* readSseData(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const extractData = (rawEvent: string) =>
    rawEvent
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""))
      .join("\n");

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // stream: true → 被切在两个 chunk 中间的中文 / emoji 不会变成乱码
      buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, "\n");

      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const data = extractData(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        if (data) yield data;
      }
    }

    buffer = (buffer + decoder.decode()).replace(/\r\n/g, "\n");
    const tail = extractData(buffer);
    if (tail) yield tail;
  } finally {
    reader.cancel().catch(() => {});
  }
}