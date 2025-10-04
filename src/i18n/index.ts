import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import itTranslation from '../../locales/it/translation.json';
import enTranslation from '../../locales/en/translation.json';
import arTranslation from '../../locales/ar/translation.json';

const resources = {
  it: {
    translation: itTranslation,
  },
  en: {
    translation: enTranslation,
  },
  ar: {
    translation: arTranslation,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language is English
    fallbackLng: 'en', // Fallback to English if translation is missing
    debug: __DEV__, // Enable debug mode in development
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Helper function to check if language is RTL
export const isRTL = (language: string): boolean => {
  return language === 'ar';
};

// Helper function to get text direction
export const getTextDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

export default i18n;
