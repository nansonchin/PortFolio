type ProjectSearchProps={
    value:string,
    onChange:(value:string)=>void;
}

function ProjectSearch({
    value,
    onChange,
}:ProjectSearchProps){
    return(
        <label className="flex w-full  items-center gap-3 border border-line px-4 py-3 transition-colors focus-within:border-gold md:max-w-xl">
            <span aria-hidden="true" className="font-system text-sm text-gold">
                &gt;
            </span>
            <input
                value={value}
                onChange={(event)=>onChange(event.target.value)}
                placeholder="search title or tech"
                aria-label="Search Projects"
                spellCheck={false}
                autoComplete="off"
                className="w-full bg-transparent font-system text-sm text-paper outline-none placeholder:text-gold-dim"
            />
            {
                value && (
                    <button type="button" 
                        onClick={()=>onChange("")}
                        className="label text-gold-dim transition-colors hover:text-gold-bright uppercase"
                    >
                        Clear
                    </button>
                )
            }
        </label>
    )
}

export default ProjectSearch