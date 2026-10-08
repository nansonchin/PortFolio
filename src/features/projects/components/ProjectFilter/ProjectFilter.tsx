type ProjectFilterProps={
    categories:string[],
    activeCategory:string,
    onChange:(category:string)=>void
}

function ProjectFilter({
    categories,
    activeCategory,
    onChange,
}:ProjectFilterProps){
    return(
        <div className="flex flex-wrap gap-4">
            {
                categories.map(category=>(
                    <button key={category} onClick={()=>onChange(category)} className={`activeCategory === category? "bg-yellow-400 text-black border-yellow-400":"border-white/20 text-white"`}>
                        {category}
                    </button>
                ))
            }
        </div>
    )
}

export default ProjectFilter