"use client";

import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({
  children,
  translations,
  language
}) => {

  const [currentLanguage, setCurrentLanguage] =
    useState(language);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setCurrentLanguage,
        translations
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () =>
  useContext(LanguageContext);