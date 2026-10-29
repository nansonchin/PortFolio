/**
 * 把一个字节流解析成 SSE 的 `data:` 内容，一个事件 yield 一次。
 *
 * 为什么要自己写缓冲，而不是 chunk 直接 JSON.parse？
 *  - 网络层随便切：一个事件可能被切成两个 chunk，两个事件也可能挤在同一个 chunk
 *  - 多字节字符（中文、emoji）可能被切在中间 → TextDecoder 必须用 { stream: true }
 *  - \r\n 的 \r 和 \n 可能分在两个 chunk → 每次都对整个 buffer 做归一化
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

      buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, "\n");

      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const data = extractData(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        if (data) yield data;
      }
    }

    // 流结束时 buffer 里可能还剩最后一个没有空行结尾的事件
    buffer = (buffer + decoder.decode()).replace(/\r\n/g, "\n");
    const tail = extractData(buffer);
    if (tail) yield tail;
  } finally {
    // 消费方提前退出（出错 / abort）时，通知上游停止，不要让连接悬着
    reader.cancel().catch(() => {});
  }
}