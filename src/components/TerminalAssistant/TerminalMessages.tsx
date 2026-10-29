import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReducedMotion } from "../../animations/glitch";
import type { TerminalMessage } from "../../types/terminal.types";

type Role = "user" | "assistant" | "system";

type Group = {
  id: string;
  role: Role;
  messages: TerminalMessage[];
};

type TerminalMessagesProps = {
  history: TerminalMessage[];
  isThinking: boolean;
};

function renderText(text: string) {
  return text.split(/(https?:\/\/\S+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-white"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function roleOf(message: TerminalMessage): Role {
  if (message.type === "command") return "user";
  if (message.type === "system") return "system";
  return "assistant";
}

function groupMessages(history: TerminalMessage[]): Group[] {
  const groups: Group[] = [];

  for (const message of history) {
    const role = roleOf(message);
    const last = groups[groups.length - 1];

    if (last && last.role === role && role !== "user") {
      last.messages.push(message);
    } else {
      groups.push({ id: message.id, role, messages: [message] });
    }
  }

  return groups;
}

function lineClass(type: TerminalMessage["type"]) {
  if (type === "success") return "text-[#D8BD83]";
  if (type === "error") return "text-red-400";
  return "text-neutral-400";
}

function ChatRow({ role, children }: { role: Role; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      gsap.from(ref.current, {
        autoAlpha: 0,
        y: 8,
        x: role === "user" ? 14 : role === "assistant" ? -14 : 0,
        duration: 0.35,
        ease: "power3.out",
      });
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}

function AssistantBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-[10px] tracking-[0.15em] text-[#D8BD83]">JARVIS</span>
      <div className="max-w-[90%] rounded-lg rounded-bl-sm border border-white/10 bg-[#101010] px-3 py-2">
        {children}
      </div>
    </div>
  );
}

export default function TerminalMessages({ history, isThinking }: TerminalMessagesProps) {
  const groups = groupMessages(history);

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => {
        if (group.role === "system") {
          return (
            <ChatRow key={group.id} role="system">
              <div className="space-y-1 text-center text-[11px] leading-5 tracking-wide text-neutral-500">
                {group.messages.map((m) => (
                  <p key={m.id} className="break-words whitespace-pre-wrap">
                    {renderText(m.text)}
                  </p>
                ))}
              </div>
            </ChatRow>
          );
        }

        if (group.role === "user") {
          return (
            <ChatRow key={group.id} role="user">
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] tracking-[0.15em] text-neutral-500">YOU</span>
                <div className="max-w-[85%] rounded-lg rounded-br-sm border border-[#C9A96E]/40 bg-[#C9A96E]/10 px-3 py-2 text-[#F5F5F5]">
                  <p className="break-words whitespace-pre-wrap">
                    {renderText(group.messages[0].text)}
                  </p>
                </div>
              </div>
            </ChatRow>
          );
        }

        return (
          <ChatRow key={group.id} role="assistant">
            <AssistantBubble>
              {group.messages.map((m) => (
                <p key={m.id} className={`break-words whitespace-pre-wrap ${lineClass(m.type)}`}>
                  {renderText(m.text)}
                </p>
              ))}
            </AssistantBubble>
          </ChatRow>
        );
      })}

      {isThinking && (
        <ChatRow key="thinking" role="assistant">
          <AssistantBubble>
            <p className="text-neutral-400">
              thinking<span className="blink ml-1 text-[#D8BD83]">▌</span>
            </p>
          </AssistantBubble>
        </ChatRow>
      )}
    </div>
  );
}