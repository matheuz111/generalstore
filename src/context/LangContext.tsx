// src/context/LangContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Lang } from "../i18n/translations";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (section: keyof typeof translations, key: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("ES");

  const t = (section: keyof typeof translations, key: string): string => {
    const sec = translations[section] as Record<string, Record<Lang, string>>;
    return sec?.[key]?.[lang] ?? key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
};