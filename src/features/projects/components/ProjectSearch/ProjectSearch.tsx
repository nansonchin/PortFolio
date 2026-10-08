type ProjectSearchProps={
    value:string,
    onChange:(value:string)=>void;
}

function ProjectSearch({
    value,
    onChange,
}:ProjectSearchProps){
    return(
        <input
            value={value}
            onChange={
                event=>onChange(event.target.value)
            }
            placeholder="Search Projects ..."
            className="w-full md:w-96 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white outline-none"
        />
    )
}

export default ProjectSearch