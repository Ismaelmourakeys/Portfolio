// src/i18n.js — configuração do i18next
// Instale com: pnpm add i18next react-i18next i18next-browser-languagedetector

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ptTranslation from "./language/translation.json";
import enTranslation from "./language/translationEN.json";
import esTranslation from "./language/translationES.json";

i18n
  .use(LanguageDetector)   // detecta o idioma do browser automaticamente
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptTranslation },
      en: { translation: enTranslation },
      es: { translation: esTranslation },
    },
    fallbackLng: "pt",     // idioma padrão se não detectar
    interpolation: {
      escapeValue: false,  // React já escapa por padrão
    },
    detection: {
      // Ordem de detecção: localStorage → browser → padrão
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
