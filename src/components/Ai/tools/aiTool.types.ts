export type ToolName =
  | "project_search"
  | "navigate";


export type ToolRequest = {

  tool:ToolName;

  input:string;

};


export type ToolResponse = {

  success:boolean;

  data?:unknown;

  message:string;

};