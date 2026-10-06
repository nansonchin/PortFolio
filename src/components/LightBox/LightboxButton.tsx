export type LightboxButtonProps={
    children:React.ReactNode;
    onClick:()=>void;
    ariaLabel:string
}


function LightboxButton({

    children,

    onClick,

    ariaLabel

}: LightboxButtonProps) {

    return (

        <button

            onClick={onClick}

            aria-label={ariaLabel}

            className="
            text-white

            border

            border-white/20

            px-6

            py-3

            rounded-full

            hover:border-yellow-400

            transition

            duration-300
            "

        >

            {children}

        </button>

    );

}

export default LightboxButton;