import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enNav from "./locales/en/nav.json";
import enHome from "./locales/en/home.json";
import enShop from "./locales/en/shop.json";
import enCart from "./locales/en/cart.json";
import enRepair from "./locales/en/repair.json";
import enProfile from "./locales/en/profile.json";
import enAuth from "./locales/en/auth.json";
import enStatic from "./locales/en/static.json";
import enAdmin from "./locales/en/admin.json";

import frCommon from "./locales/fr/common.json";
import frNav from "./locales/fr/nav.json";
import frHome from "./locales/fr/home.json";
import frShop from "./locales/fr/shop.json";
import frCart from "./locales/fr/cart.json";
import frRepair from "./locales/fr/repair.json";
import frProfile from "./locales/fr/profile.json";
import frAuth from "./locales/fr/auth.json";
import frStatic from "./locales/fr/static.json";
import frAdmin from "./locales/fr/admin.json";

const resources = {
  en: {
    common: enCommon,
    nav: enNav,
    home: enHome,
    shop: enShop,
    cart: enCart,
    repair: enRepair,
    profile: enProfile,
    auth: enAuth,
    static: enStatic,
    admin: enAdmin,
  },
  fr: {
    common: frCommon,
    nav: frNav,
    home: frHome,
    shop: frShop,
    cart: frCart,
    repair: frRepair,
    profile: frProfile,
    auth: frAuth,
    static: frStatic,
    admin: frAdmin,
  },
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  // French is the default: the first entry is what a visitor with no stored
  // preference gets. "en" stays in the chain as the missing-key fallback, so a
  // key absent from a language degrades to English instead of cross-language.
  fallbackLng: ["fr", "en"],
  supportedLngs: ["en", "fr"],
  ns: ["common", "nav", "home", "shop", "cart", "repair", "profile", "auth", "static", "admin"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
  detection: {
    // French is the product default. "navigator" is deliberately not in this
    // list: it would let an English browser override the default. The only
    // thing that overrides French is an explicit choice saved under jam_lang.
    order: ["localStorage"],
    lookupLocalStorage: "jam_lang",
    caches: ["localStorage"],
  },
});

// Keep <html lang> truthful so screen readers apply the right pronunciation
// rules and the browser offers the right spellcheck/dictionaries.
if (typeof document !== "undefined") {
  const applyDocumentLang = (lng) => {
    const short = String(lng || "fr").split("-")[0].toLowerCase();
    document.documentElement.lang = short === "en" ? "en" : "fr";
  };
  i18n.on("languageChanged", applyDocumentLang);
  applyDocumentLang(i18n.resolvedLanguage);
}

export default i18n;