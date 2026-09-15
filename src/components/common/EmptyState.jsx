import React from "react";
import { PackageSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

const EmptyState = ({ title, description = "", icon: Icon = PackageSearch, action }) => {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
      <Icon className="text-gray-300" size={48} />
      <h3 className="font-display text-lg font-semibold text-ink-900">{title || t("empty.title")}</h3>
      {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
