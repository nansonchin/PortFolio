import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { askJarvis } from "../components/Ai/services/chatService";
import { parseCommand } from "../components/TerminalAssistant/commands/parseCommand"; // 按你的实际路径改
import type { TerminalMessage, TerminalMessageType } from "../types/terminal.types";
import { JARVIS_OPEN_EVENT } from "../components/TerminalAssistant/terminalEvent";
import { ProxyError } from "../components/Ai/provider/proxyProvider";

const WELCOMES_MESSAGES:TerminalMessage[]=[
  {
    id: "welcome-1",
  type: "system",
  text: 'JARVIS online. Ask me anything about this portfolio, or type "help".',
  },{
    id:"welcome-2",
    type:"system",
    text:"[ NOTICE ] Questions are processed by Google Gemini. Free plan: content may be used to improve Google's products."
  }
]


export function useTerminal() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalMessage[]>(WELCOMES_MESSAGES);
  const [isThinking, setIsThinking] = useState(false);

  const inputHistory = useRef<string[]>([]);
  const cursor = useRef(-1);

  const push = useCallback((type: TerminalMessageType, text: string) => {
    setHistory((prev) => [...prev, { id: crypto.randomUUID(), type, text }]);
  }, []);

  const openExternal = useCallback((url:string)=>{
    window.open(url,"_blank","noopener,noreferrer")
  },[])

  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(()=>{
    const open = (event:Event) => {
      const detail = (event as CustomEvent<{prompt?:string}>).detail;
      setIsOpen(true)
      if(detail?.prompt) setCommand(detail.prompt) 
    }
    window.addEventListener(JARVIS_OPEN_EVENT,open);

    return()=>window.removeEventListener(JARVIS_OPEN_EVENT,open)
  },[])

  const submit = useCallback(async () => {
    const input = command.trim();
    if (!input || isThinking) return;

    setCommand("");
    inputHistory.current.push(input);
    cursor.current = -1;
    push("command", `> ${input}`);

    const local = await parseCommand(input);
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
      const reply = await askJarvis(input, { navigate,openExternal });
      setHistory((prev) => prev.filter((m) => m.id !== pendingId));
      push("success", reply);
    } catch (error) {
      setHistory((prev) => prev.filter((m) => m.id !== pendingId));
      push("error", error instanceof ProxyError ? error.userMessage :"JARVIS is unavailable right now. Try a command like : `projects` " );
    } finally {
      setIsThinking(false);
    }
  }, [command, isThinking, navigate,openExternal, push]);

  const navigateHistory = useCallback((direction: "up" | "down") => {
    const list = inputHistory.current;
    if (list.length === 0) return;

    if (direction === "up") {
      cursor.current =
        cursor.current === -1 ? list.length - 1 : Math.max(cursor.current - 1, 0);
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

  return {
    isOpen, toggle, close,
    history, command, setCommand,
    submit, navigateHistory, isThinking,
  };
}