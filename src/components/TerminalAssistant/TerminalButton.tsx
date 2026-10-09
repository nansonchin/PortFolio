type TerminalButtonProps = {
    isOpen:boolean;
    onToggle:()=>void;
};


export default function TerminalButton({
    isOpen,
    onToggle
}:TerminalButtonProps){

    return(

        <button
            type="button"
            aria-label={
                isOpen
                ?
                "Close terminal"
                :
                "Open terminal"
            }
            aria-expanded={isOpen}
            onClick={onToggle}
            className="
            fixed
            bottom-6
            left-6
            z-[10000]
            flex
            h-14
            items-center
            gap-3
            rounded-full
            border
            border-[#C9A96E]/50
            bg-[#0B0B0B]
            px-5
            text-[#D8BD83]
            "
        >

            <span>
                &gt;
            </span>


            <span className="
                text-xs
                tracking-[0.18em]
            ">
                TERMINAL
            </span>


            <span
                className={`
                h-2
                w-2
                rounded-full
                bg-[#D8BD83]
                ${
                    isOpen
                    ?
                    "opacity-100"
                    :
                    "animate-pulse opacity-70"
                }
                `}
            />

        </button>

    )

}