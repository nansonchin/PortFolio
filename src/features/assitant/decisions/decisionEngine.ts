import type { AssistantIntent } from "../ai/assistant.types";

import type { AssistantDecision } from "./decision.type";


type DecisionInput = {

  intent: AssistantIntent;

  confidence:number;

  path?:string;

};



export function makeDecision(
  input:DecisionInput
):AssistantDecision {



  /**
   * ===============================
   * General conversation
   * ===============================
   */

  if(input.intent === "general"){

    return {

      type:"general",

    };

  }



  /**
   * ===============================
   * Navigation
   * ===============================
   */

  if(
    input.intent === "navigate"
    &&
    input.confidence >= 70
  ){

    return {

      type:"navigate",

      path:
      input.path ?? "/",


      reason:
      "High confidence navigation request",

    };

  }



  /**
   * ===============================
   * Need clarification
   * ===============================
   */

  if(
    input.confidence < 50
  ){

    return {

      type:"ask",

      question:
      "Could you clarify what you would like to explore?",


      reason:
      "Low confidence result.",

    };

  }



  /**
   * ===============================
   * Answer
   * ===============================
   */

  return {

    type:"answer",

    reason:
    "Request can be answered without navigation",

  };

}