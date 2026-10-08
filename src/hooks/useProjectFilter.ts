import { useMemo, useState } from "react"
import type { ProjectCardModel } from "../models/ProjectCardModel"

type UseProjectFilterProps={
    projects:ProjectCardModel[]
}

export function useProjectFilter({
    projects
}:UseProjectFilterProps){
    const [activeCategory,setActiveCategory]= useState("All")
    const [searchQuery,setSearchQuery]=useState("")

    const filteredProjects=useMemo(()=>{
        return projects.filter(project=>{
            const matchCategory= activeCategory ==="All" || project.category === activeCategory

            const matchSearch=project.title.toLowerCase().includes(searchQuery.toLowerCase())||
            project.technologies.some(tech=>tech.toLowerCase().includes(searchQuery.toLowerCase()))
        
            return(matchCategory && matchSearch)
        })
    },[projects,activeCategory,searchQuery])

    return{
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filteredProjects,
    }
}