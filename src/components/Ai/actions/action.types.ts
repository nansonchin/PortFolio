export type AssistantActionType =
  | "navigate";



export type NavigateAction =
{
  type:"navigate";

  slug:string;
};



export type AssistantAction =
  NavigateAction;