import { useCallback, useEffect, useRef, useState } from "react";
import { askJarvis } from "../components/Ai/services/chatService";
import { parseCommand } from "../components/TerminalAssistant/commands/parseCommand"; // 按你的实际路径改
import type {
  TerminalMessage,
  TerminalMessageType,
} from "../types/terminal.types";
import { JARVIS_OPEN_EVENT, type JarvisOpenDetail } from "../components/TerminalAssistant/terminalEvent";
import { ProxyError, isAbortError } from "../components/Ai/provider/proxyProvider";
import { useTransitionNavigate } from "./useTransitionNavigate";

export const SUGGESTED_QUESTIONS = [
  "What's your best project?",
  "What technologies do you use?",
  "Show me your front end projects",
  "Take me to your Github",
] as const;

const WELCOME_MESSAGES: TerminalMessage[] = [
  {
    id: "welcome-1",
    type: "system",
    text: 'JARVIS online. Ask me anything about this portfolio, or type "help".',
  },
  {
    id: "welcome-2",
    type: "system",
    text: "[ NOTICE ] Questions are processed by Google Gemini. Free plan: content may be used to improve Google's products.",
  },
];

function isFocusedOnInput(): boolean {
  const el = document.activeElement;
  if (!el) return false;

  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if ((el as HTMLElement).isContentEditable) return true;

  return false;
}

export function useTerminal() {
  const go = useTransitionNavigate();
  // AI 和本地命令跳转都用最完整的 2 秒转场
  const navigate = useCallback(
    (path: string) => go(path, { variant: "full" }),
    [go],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalMessage[]>(WELCOME_MESSAGES);
  // true = 从发送到回复完全结束（包括流式输出期间），期间不允许再发送
  const [isThinking, setIsThinking] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(true);

  const inputHistory = useRef<string[]>([]);
  const cursor = useRef(-1);
  const abortRef = useRef<AbortController | null>(null);

  const push = useCallback((type: TerminalMessageType, text: string) => {
    setHistory((prev) => [...prev, { id: crypto.randomUUID(), type, text }]);
  }, []);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  // 组件卸载时取消还在进行的请求，不要让它在后台继续跑
  useEffect(() => () => abortRef.current?.abort(), []);

  const submitText = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed || isThinking) return;

      setShowSuggestions(false);

      inputHistory.current.push(trimmed);
      cursor.current = -1;

      push("command", trimmed);

      const local = await parseCommand(trimmed);
      if (local) {
        if (local.type === "clear") {
          setHistory([]);
          return;
        }
        local.lines.forEach((line) =>
          push(local.type === "navigation" ? "success" : "output", line),
        );
        if (local.type === "navigation") navigate(local.path);
        return;
      }

      setIsThinking(true);

      const controller = new AbortController();
      abortRef.current = controller;

      // 这条流式回复在 history 里对应的消息 id
      const replyId = crypto.randomUUID();

      // 把“追加或创建”写成幂等的更新函数：StrictMode 下 updater 会被调用两次也不会出错
      const upsertReply = (update: (previous: string) => string) =>
        setHistory((prev) =>
          prev.some((m) => m.id === replyId)
            ? prev.map((m) => (m.id === replyId ? { ...m, text: update(m.text) } : m))
            : [...prev, { id: replyId, type: "success", text: update("") }],
        );

      // 一个 token 一次 setState 会让整个面板疯狂重渲染。
      // 把这一帧内收到的所有 delta 合并，每帧最多更新一次。
      let pending = "";
      let frame = 0;

      const flush = () => {
        frame = 0;
        if (!pending) return;
        const chunk = pending;
        pending = "";
        upsertReply((previous) => previous + chunk);
      };

      const onTextDelta = (delta: string) => {
        pending += delta;
        if (!frame) frame = requestAnimationFrame(flush);
      };

      try {
        const reply = await askJarvis(
          trimmed,
          {
            navigate: (path) => navigate(path),
            openExternal: (url) =>
              window.open(url, "_blank", "noopener,noreferrer"),
          },
          { onTextDelta, signal: controller.signal },
        );

        // 以最终结果为准，覆盖流式过程中累积的文字（也顺便丢掉没来得及 flush 的 pending）
        cancelAnimationFrame(frame);
        pending = "";
        upsertReply(() => reply);
      } catch (error) {
        // 把已经收到的文字先显示出来，再决定怎么处理错误
        cancelAnimationFrame(frame);
        flush();

        if (isAbortError(error)) return; // 用户主动取消 / 组件卸载：不需要报错

        console.error(error);
        push(
          "error",
          error instanceof ProxyError
            ? error.userMessage
            : "JARVIS is unavailable right now. Try a command like: projects",
        );
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setIsThinking(false);
      }
    },
    [isThinking, navigate, push],
  );

  const submit = useCallback(async () => {
    const text = command.trim();
    setCommand("");
    await submitText(text);
  }, [command, submitText]);

  const sendSuggestion = useCallback(
    async (question: string) => {
      await submitText(question);
    },
    [submitText],
  );

  const navigateHistory = useCallback((direction: "up" | "down") => {
    const list = inputHistory.current;
    if (list.length === 0) return;

    if (direction === "up") {
      cursor.current =
        cursor.current === -1
          ? list.length - 1
          : Math.max(cursor.current - 1, 0);
      setCommand(list[cursor.current]);
      return;
    }

    if (cursor.current === -1) return;
    const next = cursor.current + 1;
    if (next >= list.length) {
      cursor.current = -1;
      setCommand("");
    } else {
      cursor.current = next;
      setCommand(list[next]);
    }
  }, []);

  useEffect(() => {
    const open = (event: Event) => {
      const detail = (event as CustomEvent<JarvisOpenDetail>).detail;
      setIsOpen(true);
      if (detail?.prompt) setCommand(detail.prompt);
    };

    window.addEventListener(JARVIS_OPEN_EVENT, open);
    return () => window.removeEventListener(JARVIS_OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isOpen) return;

      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (isFocusedOnInput()) return;

      if (event.key === "/") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    close,
    history,
    command,
    setCommand,
    submit,
    navigateHistory,
    isThinking,
    showSuggestions,
    sendSuggestion,
  };
}