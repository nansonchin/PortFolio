import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_LANGUAGE, LANGUAGES, type Language } from "./types";
import { en, type TranslationKey } from "./locales/en";
import { zh } from "./locales/zh";

const STORAGE_KEY = "portfolio-language";

const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  en,
  zh,
};

type TranslateVars = Record<string, string | number>;

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: TranslateVars) => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((item) => item.code === value);
}

/** 1) saved choice  2) browser language  3) default */
function detectInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (isLanguage(saved)) {
      return saved;
    }
  } catch {
    // localStorage can be blocked (private mode) – just continue
  }

  const browserLanguage = navigator.language?.toLowerCase()
  const matchLanguage = LANGUAGES.find((item)=>browserLanguage?.startsWith(item.htmlLang.toLowerCase()))

  if(matchLanguage){
    return matchLanguage.code
  }

  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(detectInitialLanguage);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  // keep <html lang="..."> and localStorage in sync with the state
  useEffect(() => {
    const htmlLang = LANGUAGES.find((item) => item.code === lang)?.htmlLang;

    document.documentElement.lang = htmlLang ?? lang;

    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey, vars?: TranslateVars) => {
      // missing in this language → fall back to English → fall back to the key
      let text = dictionaries[lang][key] ?? en[key] ?? key;

      if (vars) {
        Object.entries(vars).forEach(([name, value]) => {
          text = text.replaceAll(`{${name}}`, String(value));
        });
      }

      return text;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return(
    <LanguageContext.Provider value={value}>
    {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}