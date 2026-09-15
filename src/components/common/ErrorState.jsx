import React from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ErrorState = ({ message, onRetry }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
      <AlertTriangle className="text-red-400" size={40} />
      <p className="text-sm font-medium text-red-700">{message || t("errors.somethingWentWrong")}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-2 !px-4 !py-2 text-sm">
          {t("errors.tryAgain")}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
