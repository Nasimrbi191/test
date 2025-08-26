import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18next
  .use(HttpBackend) // Load translations from public/locales
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Bind i18next to React
  .init({
    fallbackLng: "en", // Default language if detection fails
    lng: "fr", // Initial language
    supportedLngs: ["en", "fr"], // Supported languages
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    detection: {
      order: ["navigator", "cookie", "localStorage", "querystring", "htmlTag"], // Language detection order
      caches: ["localStorage", "cookie"], // Cache language selection
    },
    interpolation: {
      escapeValue: false, // React handles XSS safety
    },
  });
