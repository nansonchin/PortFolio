import type { ProjectAiContext } from "../../../components/Ai/context/AiContext";


export function buildProjectInfoResponse(
    project:ProjectAiContext
){

    const lines:string[]=[];


    lines.push(
        `I found ${project.title}.`
    );


    lines.push("");


    lines.push(
        project.description
    );


    lines.push("");



    if(project.technologies.length){

        lines.push(
            "Technologies:"
        );


        project.technologies.forEach(
            tech=>{
                lines.push(
                    `✓ ${tech}`
                )
            }
        );

        lines.push("");
    }



    if(project.features.length){

        lines.push(
            "Features:"
        );


        project.features.forEach(
            feature=>{
                lines.push(
                    `✓ ${feature}`
                )
            }
        );
    }



    if(project.architecture){

        lines.push("");

        lines.push(
            "Architecture documentation available."
        )
    }


    return lines.join("\n");
}