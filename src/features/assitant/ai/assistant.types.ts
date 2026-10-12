export type AssistantIntent= 
    | "navigate"
    | "project_info"
    | "general"
    | "architecture"

    export type AssistantAction = 
        {
            type:"navigate";
            path:string
        }
    export type AssistantResponse = {
        message:string;
        intent:AssistantIntent;
        action?:AssistantAction
    }