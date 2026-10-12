export type AssistantDecision = 
    | {
        type:"navigate";
        path:string;
        reason:string;
    }
    |{
        type:"answer";
        reason:string;
    }
    |{
        type:"ask";
        question:string;
        reason:string;
    }
    | {
      type:"general";
    };