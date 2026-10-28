import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { askJarvis } from "../components/Ai/services/chatService";
import { parseCommand } from "../components/TerminalAssistant/commands/parseCommand"; // 按你的实际路径改
import type {
  TerminalMessage,
  TerminalMessageType,
} from "../types/terminal.types";
import { JARVIS_OPEN_EVENT, type JarvisOpenDetail } from "../components/TerminalAssistant/terminalEvent";
import { ProxyError } from "../components/Ai/provider/proxyProvider";
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
 const navigate = useTransitionNavigate(); 

  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalMessage[]>(WELCOME_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(true);

  const inputHistory = useRef<string[]>([]);
  const cursor = useRef(-1);

  const push = useCallback((type: TerminalMessageType, text: string) => {
    setHistory((prev) => [...prev, { id: crypto.randomUUID(), type, text }]);
  }, []);

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  const submitText = useCallback(
    async (input: string) => {
      const trimmed = input.trim();
      if (!trimmed || isThinking) return;

      setShowSuggestions(false);

      inputHistory.current.push(trimmed);
      cursor.current = -1;

      push("command", `> ${trimmed}`);

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

      const pendingId = crypto.randomUUID();
      setHistory((prev) => [
        ...prev,
        { id: pendingId, type: "system", text: "JARVIS is thinking..." },
      ]);
      setIsThinking(true);

      try {
        const reply = await askJarvis(trimmed, {
          navigate: (path) => navigate(path),
          openExternal: (url) =>
            window.open(url, "_blank", "noopener,noreferrer"),
        });
        setHistory((prev) => prev.filter((m) => m.id !== pendingId));
        push("success", reply);
      } catch (error) {
        console.error(error);
        setHistory((prev) => prev.filter((m) => m.id !== pendingId));
        push(
          "error",
          error instanceof ProxyError
            ? error.userMessage
            : "JARVIS is unavailable right now. Try a command like: projects",
        );
      } finally {
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
