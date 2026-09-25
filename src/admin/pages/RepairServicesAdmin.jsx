import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const RepairServicesAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("repairServices.title")}
      resource="repairs/services"
      description={t("repairServices.description")}
      fields={[
        { name: "name", label: t("fields.name"), required: true },
        { name: "slug", label: t("fields.slug") },
        { name: "icon", label: t("fields.icon") },
        { name: "image", label: t("fields.image"), type: "image" },
        { name: "shortDescription", label: t("fields.shortDescription") },
        { name: "fullDescription", label: t("fields.fullDescription"), type: "textarea" },
        { name: "estimatedTime", label: t("repairServices.estimatedTime") },
        { name: "warranty", label: t("repairServices.warranty") },
        { name: "sortOrder", label: t("fields.sortOrder"), type: "number" },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
        {
          name: "compatibleCategories", label: t("repairServices.compatibleCategories"), type: "multiselect",
          optionsResource: "device-catalog/categories", section: t("repairServices.compatibilitySection"),
        },
        { name: "compatibleBrands", label: t("repairServices.compatibleBrands"), type: "multiselect", optionsResource: "device-catalog/brands" },
        { name: "compatibleModels", label: t("repairServices.compatibleModels"), type: "multiselect", optionsResource: "device-catalog/models" },
        {
          name: "compatibleVariants", label: t("repairServices.compatibleVariants"), type: "multiselect",
          optionsResource: "device-catalog/variants",
          optionLabel: (variant) => [variant.deviceModel?.brand?.name, variant.deviceModel?.name, variant.label].filter(Boolean).join(" — "),
        },
        { name: "translations.fr.name", label: t("fields.nameFr"), section: "French Translation" },
        { name: "translations.fr.shortDescription", label: t("fields.shortDescriptionFr"), type: "textarea" },
        { name: "translations.fr.fullDescription", label: t("fields.fullDescriptionFr"), type: "textarea" },
        { name: "translations.fr.estimatedTime", label: t("repairServices.estimatedTimeFr") },
        { name: "translations.fr.warranty", label: t("repairServices.warrantyFr") },
      ]}
      columns={[
        { key: "name", label: t("fields.name") },
        { key: "estimatedTime", label: t("repairServices.estTime") },
        { key: "warranty", label: t("repairServices.colWarranty") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default RepairServicesAdmin;