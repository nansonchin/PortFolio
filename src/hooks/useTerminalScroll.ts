import { useEffect, useRef } from "react";

// 距离底部多少 px 以内算“正在看最新内容”
const STICK_THRESHOLD = 48;

/**
 * 内容增长时自动滚到底部 —— 但只在用户本来就在底部附近时才这样做。
 *
 * 流式输出时内容每一帧都在增长：
 * 如果无条件滚到底，用户往上翻着看之前的回复，就会被一次次强行拉回去，
 * 这是流式 UI 里最让人火大的细节之一（ChatGPT 的做法就是“贴底才跟随”）。
 */
export function useTerminalScroll(dependency: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const distance =
        container.scrollHeight - container.scrollTop - container.clientHeight;
      stickRef.current = distance <= STICK_THRESHOLD;
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !stickRef.current) return;

    container.scrollTop = container.scrollHeight;
  }, [dependency]);

  return containerRef;
}