import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation("static");
  return (
    <div className="container-px section-y mx-auto max-w-3xl prose">
      <h1 className="mb-6 font-display text-3xl font-bold">{t("privacy.title")}</h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-600">
        <p>{t("privacy.items.0")}</p>
        <p>{t("privacy.items.1")}</p>
        <p>{t("privacy.items.2")}</p>
        <p>{t("privacy.items.3")}</p>
      </div>
    </div>
  );
};
export default PrivacyPolicy;