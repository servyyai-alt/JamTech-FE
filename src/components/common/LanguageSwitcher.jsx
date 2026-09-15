import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith("fr") ? "fr" : "en";

  const switchLang = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="pointer-events-none absolute left-2.5 text-gray-500">
        <Languages size={16} />
      </span>
      <select
        value={current}
        onChange={switchLang}
        aria-label="Language"
        className="appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-8 pr-6 text-sm font-medium text-ink-700 outline-none transition hover:border-gray-300 focus:border-primary-400"
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
      </select>
      <span className="pointer-events-none absolute right-2.5 text-xs text-gray-500">▾</span>
    </label>
  );
};

export default LanguageSwitcher;