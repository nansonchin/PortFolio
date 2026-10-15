import { useContext } from "react";
import { IntroContext } from "../components/Intro/IntroContext";

export function useIntro(){
    const context = useContext(IntroContext)

    if(!context){
        throw new Error("useIntro must be used inside Intro Provider")
    }

    return context
}