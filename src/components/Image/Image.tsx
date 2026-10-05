type ImageProps={
    src:string;
    alt:string;
    className?:string
}

function Image({
    src,alt,className
}:ImageProps){
    return(
        <img src={src} alt={alt} loading="lazy" decoding="async" className={className}/>
    )
}

export default Image