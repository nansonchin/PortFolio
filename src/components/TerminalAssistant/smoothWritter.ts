import { prefersReducedMotion } from "../../animations/glitch";

/**
 * 把“网络上文字到达的节奏”和“屏幕上文字出现的节奏”分开。
 *
 * 为什么需要？
 *  Gemini flash-lite 非常快，而且一个 chunk 往往就是一两句话。
 *  就算服务端是真·流式，用户看到的也是“几块大文字突然弹出来”，像是没有流式。
 *  ChatGPT / Claude 的界面看起来很顺，是因为它们在前端又做了一层平滑。
 *
 * 做法：到达的文字先进队列，每一帧只放出几个字，
 * 积压越多放得越快（自适应），所以不会因为“演得太慢”而落后太多。
 */

const BASE_CHARS_PER_FRAME = 2; // ≈ 120 字/秒（60fps）：积压很少时的正常打字速度
const MAX_CHARS_PER_FRAME = 40; // 单帧上限，避免极端情况下一次吐一大坨
const CATCH_UP_FRAMES = 30; // 积压 / 30 = 本帧放出的字数 → 约 0.5 秒追平大部分积压

const isHighSurrogate = (code: number) => code >= 0xd800 && code <= 0xdbff;

export type SmoothWriter = {
  /** 收到一段新文字（可以是任意大小） */
  push: (text: string) => void;
  /** 等队列自然播完。标签页在后台时会立刻写完，不会卡住。 */
  drain: () => Promise<void>;
  /** 立刻把队列里剩下的全部写出（取消 / 出错 / 卸载时用） */
  flush: () => void;
};

export function createSmoothWriter(write: (chunk: string) => void): SmoothWriter {
  let queue = "";
  let frame = 0;
  let waiters: Array<() => void> = [];

  const settle = () => {
    const list = waiters;
    waiters = [];
    list.forEach((resolve) => resolve());
  };

  const tick = () => {
    frame = 0;

    if (!queue) {
      settle();
      return;
    }

    const count = Math.min(
      MAX_CHARS_PER_FRAME,
      Math.max(BASE_CHARS_PER_FRAME, Math.ceil(queue.length / CATCH_UP_FRAMES)),
    );

    let end = Math.min(count, queue.length);

    // 别把 emoji 之类的“代理对”从中间切开
    if (end < queue.length && isHighSurrogate(queue.charCodeAt(end - 1))) end += 1;

    const chunk = queue.slice(0, end);
    queue = queue.slice(end);
    write(chunk);

    if (queue) frame = requestAnimationFrame(tick);
    else settle();
  };

  const flush = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;

    if (queue) {
      const rest = queue;
      queue = "";
      write(rest);
    }

    settle();
  };

  return {
    push(text) {
      if (!text) return;
      queue += text;

      // 不需要动画 / 标签页在后台（requestAnimationFrame 会被暂停）→ 直接写
      if (prefersReducedMotion() || document.hidden) {
        flush();
        return;
      }

      if (!frame) frame = requestAnimationFrame(tick);
    },

    drain() {
      if (!queue) return Promise.resolve();

      if (document.hidden) {
        flush();
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        // 播放过程中用户切走标签页：别让整个回复卡在“thinking”
        const onVisibility = () => {
          if (document.hidden) flush();
        };

        document.addEventListener("visibilitychange", onVisibility);
        waiters.push(() => {
          document.removeEventListener("visibilitychange", onVisibility);
          resolve();
        });
      });
    },

    flush,
  };
}