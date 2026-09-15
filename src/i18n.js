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
  fallbackLng: "en",
  supportedLngs: ["en", "fr"],
  ns: ["common", "nav", "home", "shop", "cart", "repair", "profile", "auth", "static", "admin"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator"],
    lookupLocalStorage: "jam_lang",
    caches: ["localStorage"],
  },
});

export default i18n;