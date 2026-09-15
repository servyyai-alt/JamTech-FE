import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation("static");
  return (
    <div className="container-px section-y mx-auto flex max-w-lg flex-col items-center text-center">
      <h1 className="font-display text-6xl font-extrabold text-primary-600">404</h1>
      <p className="mt-3 text-lg font-semibold text-ink-900">{t("notFound.title")}</p>
      <p className="mt-1 text-sm text-gray-500">{t("notFound.description")}</p>
      <Link to="/" className="btn-primary mt-6">{t("notFound.backHome")}</Link>
    </div>
  );
};
export default NotFound;