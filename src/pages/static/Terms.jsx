import React from "react";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation("static");
  return (
    <div className="container-px section-y mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-bold">{t("terms.title")}</h1>
      <div className="space-y-4 text-sm leading-relaxed text-gray-600">
        <p>{t("terms.items.0")}</p>
        <p>{t("terms.items.1")}</p>
        <p>{t("terms.items.2")}</p>
        <p>{t("terms.items.3")}</p>
      </div>
    </div>
  );
};
export default Terms;