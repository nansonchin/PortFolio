import { useLanguage } from "./LanguageContext";
import { LANGUAGES } from "./types";

function LanguageSwitch(){
    const {lang,setLang,t}= useLanguage()

    return(
        <div role="group" aria-label={t("nav.switchLanguage")} className="flex items-center gap-1">
            {LANGUAGES.map((item,index)=>(
                <span key={item.code} className="flex items-center gap-1">
                    {index>0 &&<span className="label text-gold-dim/50">/</span>}
                    <button type="button" lang={item.htmlLang} aria-pressed={lang === item.code}
                        onClick={()=>setLang(item.code)}
                        className={`label px-1.5 py-1 transition-colors ${lang===item.code?"text-gold-bright":"text-gold-dim hover:text-gold-bright"}`}
                    >
                        {item.label}
                    </button>
                </span>
            ))}
        </div>
    )
}

export default LanguageSwitch
