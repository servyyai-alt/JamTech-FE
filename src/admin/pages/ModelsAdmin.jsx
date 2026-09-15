import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const ModelsAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("models.title")}
      resource="device-catalog/models"
      description={t("models.description")}
      fields={[
        { name: "name", label: t("fields.name"), required: true },
        { name: "slug", label: t("fields.slug") },
        { name: "brand", label: t("fields.brand"), type: "select", optionsResource: "device-catalog/brands", required: true },
        { name: "deviceCategory", label: t("fields.deviceCategory"), type: "select", optionsResource: "device-catalog/categories", required: true },
        { name: "deviceType", label: t("models.deviceType") },
        { name: "image", label: t("fields.image") },
        { name: "releaseYear", label: t("models.releaseYear"), type: "number" },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
        { name: "translations.fr.name", label: t("fields.nameFr"), section: "French Translation" },
        { name: "translations.fr.deviceType", label: t("models.deviceTypeFr") },
      ]}
      columns={[
        { key: "name", label: t("fields.name") },
        { key: "deviceType", label: t("fields.colType") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default ModelsAdmin;