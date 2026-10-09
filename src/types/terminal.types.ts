export type TerminalCommandName =
  | "help"
  | "projects"
  | "about"
  | "clear"
  | "navigate";

export type TerminalCommandResult =
  | {
      type: "output";
      lines: string[];
    }
  | {
      type: "clear";
      lines: string[];
    }
  | {
      type: "navigation";
      path: string;
      lines: string[];
    }
  | {
      type: "project";
      projects: unknown[];
      lines: string[];
    }
  | {
      type: "unknown";
      lines: string[];
    };

export type TerminalCommand = {
  name: TerminalCommandName;

  description: string;

  aliases?: string[];

  execute: (args: string[]) => Promise<TerminalCommandResult>;
};

// ================================
// Terminal UI Message
// ================================

export type TerminalMessageType =
  | "system"
  | "command"
  | "output"
  | "success"
  | "error";

export type TerminalMessage = {
  id: string;

  type: TerminalMessageType;

  text: string;
};
