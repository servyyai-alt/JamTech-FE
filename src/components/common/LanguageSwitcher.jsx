import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n, t } = useTranslation("nav");
  const current = i18n.language?.startsWith("fr") ? "fr" : "en";

  const switchLang = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="pointer-events-none absolute left-2.5 text-gray-500">
        <Languages size={16} aria-hidden="true" />
      </span>
      <select
        value={current}
        onChange={switchLang}
        aria-label={t("language")}
        className="appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-8 pr-6 text-sm font-medium text-ink-700 outline-none transition hover:border-gray-300 focus:border-primary-400"
      >
        <option value="en" lang="en">
          EN
        </option>
        <option value="fr" lang="fr">
          FR
        </option>
      </select>
      <span className="pointer-events-none absolute right-2.5 text-xs text-gray-500" aria-hidden="true">
        ▾
      </span>
    </label>
  );
};

export default LanguageSwitcher;

/**
 * Compact one-tap toggle for the navbar. The select above is only rendered in
 * the desktop bar (>=1320px), so narrow screens get this instead of making the
 * user open the burger menu to reach a language control.
 */
export const LanguageToggle = ({ className = "" }) => {
  const { i18n, t } = useTranslation("nav");
  const isFrench = Boolean(i18n.language?.startsWith("fr"));
  const action = t(isFrench ? "switchToEnglish" : "switchToFrench");

  return (
    <button
      type="button"
      className={`site-nav__icon site-nav__lang-toggle ${className}`}
      onClick={() => i18n.changeLanguage(isFrench ? "en" : "fr")}
      lang={isFrench ? "fr" : "en"}
      aria-label={action}
      title={action}
    >
      <Languages size={18} aria-hidden="true" />
      <span className="site-nav__count site-nav__lang-code" aria-hidden="true">
        {isFrench ? "FR" : "EN"}
      </span>
      <span className="site-nav__tooltip" aria-hidden="true">
        {action}
      </span>
    </button>
  );
};