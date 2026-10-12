export type AssistantPlanStep =
    | "search_project"
    | "load_project_memory"
    | "navigate"
    | "answer"
    | "conversation";

export type AssistantPlan={
    goal:string;
    steps:AssistantPlanStep[]
}