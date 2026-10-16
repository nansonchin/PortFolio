type GlitchTextProps={
    text:string;
    className?:string;
    loop?:boolean
}

function GlitchText({text,className="",loop=false}:GlitchTextProps){
    return(
        <span className={`glitch ${className}`} data-text={text} data-glitch-loop={loop?"" :undefined}>
            {text}
        </span>
    )
}

export default GlitchText