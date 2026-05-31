/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type AppLanguage = 'sv' | 'en';

type LanguageContextValue = {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  isEnglish: boolean;
};

const STORAGE_KEY = 'sv_app_language';

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'sv',
  setLang: () => {},
  isEnglish: false,
});

function readInitialLanguage(): AppLanguage {
  if (typeof localStorage === 'undefined') return 'sv';
  return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'sv';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>(readInitialLanguage);

  const value = useMemo<LanguageContextValue>(() => ({
    lang,
    isEnglish: lang === 'en',
    setLang: (next) => {
      setLangState(next);
      localStorage.setItem(STORAGE_KEY, next);
    },
  }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
