import type { TerminalCommand, TerminalCommandName } from "../../../types/terminal.types";

export const terminalCommands:Record<TerminalCommandName,TerminalCommand>={
    help:{
        name:"help",
        description:"Show all available commandds",
        aliases:["h","commands"],
        execute:()=>({
            type:"output",
            lines:[
                "Available commands:",
                "",
                "help       -   Show all available comands",
                "projects   -   Explore portfolio projects",
                "about      -   Learn about the developer",
                "clear       -  Clear terminal history",

            ]
        })
    },
    projects:{
        name:"projects",
        description:"Explore the portfolio projects",
        aliases:["p"],
        execute:()=>({
            type:"output",
            lines:[
                "Future add"
            ]
        })
    },
    about:{
        name:"about",
        description:"Learn about the developer",
        aliases:["whoami"],
        execute:()=>({
            type:"output",
            lines:[
                "Developer portfolio terminal.",
                "Future add"
            ]
        })
    },
    clear:{
        name:"clear",
        description:"Clear terminal history",
        aliases:["cls"],
        execute:()=>({
            type:"clear",
            lines:[]
        })
    }
}