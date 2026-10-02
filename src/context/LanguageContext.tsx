import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: (enText: string, bnText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('am_language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('am_language', lang);
  }, [lang]);

  const setLang = (l: Language) => {
    setLangState(l);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = (enText: string, bnText?: string): string => {
    if (lang === 'bn' && bnText && bnText.trim().length > 0) {
      return bnText;
    }
    return enText;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
