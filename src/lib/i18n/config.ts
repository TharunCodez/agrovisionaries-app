
export const availableLanguages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "sk", name: "Sikkimese" },
];

export const i18nOptions = {
  fallbackLng: "en",
  supportedLngs: availableLanguages.map(lang => lang.code),
  ns: ["common"],
  defaultNS: "common",
  keySeparator: ".",
  nsSeparator: ":",
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: "agrovisionaries-locale",
  },
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json"
  },
  react: { useSuspense: false }
};

