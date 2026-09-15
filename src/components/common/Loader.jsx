import React from "react";
import { useTranslation } from "react-i18next";

const Loader = ({ full = false, label }) => {
  const { t } = useTranslation("common");
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${full ? "min-h-[60vh]" : "py-10"}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      <p className="text-sm text-gray-500">{label || t("buttons.loading")}</p>
    </div>
  );
};

export default Loader;
