import { splitText } from "../../animations/textSplit"

type HeroTitleProps={
    text:string
}

function HeroTitle({
    text
}:HeroTitleProps){
    const letters = splitText(text)

    return(
        <h1 className="hero-title heading-xl flex flex-wrap" >
            {
                letters.map((item)=>(
                    <span key={item.index} className="hero-letter inline-block">
                        {
                            item.char === " "? "\u00a0":item.char
                        }
                    </span>
                ))
            }
        </h1>
    )
}

export default HeroTitle