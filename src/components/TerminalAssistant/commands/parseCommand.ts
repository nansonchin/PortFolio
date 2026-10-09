import type { TerminalCommandResult } from "../../../types/terminal.types";
import { terminalCommands } from "./terminalCommands";

export function parseCommand(
    input:string,
):TerminalCommandResult{
    const normalizedInput = input.trim().toLowerCase()

    if(!normalizedInput){
        return{
            type:"output",
            lines:["Please enter a comand"]
        }
    }

    const matchedCommand = Object.values(terminalCommands).find(
        (command)=> command.name === normalizedInput || command.aliases?.includes(normalizedInput)
    )

    if(!matchedCommand){
        return{
            type:"output",
            lines:[
                `Unknow command: "${normalizedInput}"`,
                'Type "help" to see available commands'
            ]
        }
    }

    return matchedCommand.execute();
}