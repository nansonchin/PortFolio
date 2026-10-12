import { runAssistant } from "./runAssistant";

export async function  askAssistant(
    input:string
){
    return await runAssistant(input)
}