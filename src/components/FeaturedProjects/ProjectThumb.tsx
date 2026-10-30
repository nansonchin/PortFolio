import { isUsableImage } from "./workUtils";

type ProjectThumbProps ={
    src?:string;
    alt:string;
    className?:string
}

function ProjectThumb({src,alt, className=""}:ProjectThumbProps){
    if(!isUsableImage(src)){
        return(
            <div className={`flex h-full w-full items-center justify-center border border-line bg-ink-2 ${className}`}>
                <span className="label text-gold-dim">
                    [ NO SIGNAL]
                </span>
            </div>
        )
    }

    return(
        <img src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`h-full w-full object-cover ${className}`}/>
    )
}

export default ProjectThumb