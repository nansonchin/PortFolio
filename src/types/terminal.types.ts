export type TerminalCommandName = 
    | "help"
    | "projects"
    | "about"
    | "clear";

export type TerminalCommandResult =
    | {
        type:"output",
        lines:string[]
    }
    |{
        type:"clear",
        lines:string[]
    }

export type TerminalCommand = {
    name:TerminalCommandName;
    description:string;
    aliases?:string[]
    execute:()=> TerminalCommandResult;
}