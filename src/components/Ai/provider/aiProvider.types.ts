export type AiMessageRole = 
    | "system"
    | "user"
    | "assistant"

export type AiMessage = {
    role:AiMessageRole,
    content:string
}

export type AiCompletionRequest={
    messages:AiMessage[]
}

export type AiCompletionResponse={
    content:string
}

export interface AiProvider{
    generate(
        request:AiCompletionRequest
    ):Promise<AiCompletionResponse>
}