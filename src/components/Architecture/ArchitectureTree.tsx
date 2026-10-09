import type { ProjectArchitectureModel } from "../../models/ProjectArchitectureModel"
import ArchitectureNode from "./ArchitectureNode"

type ArchitetureTreeProps ={
    architecture:ProjectArchitectureModel
}

function ArchitectureTree({
    architecture
}:ArchitetureTreeProps){
    return(
        <div className="flex justify-center">
            <ArchitectureNode node={architecture.root}/>
        </div>
    )
}

export default ArchitectureTree