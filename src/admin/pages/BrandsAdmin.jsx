import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const BrandsAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("brands.title")}
      resource="device-catalog/brands"
      description={t("brands.description")}
      fields={[
        { name: "name", label: t("fields.name"), required: true },
        { name: "slug", label: t("fields.slug") },
        {
          name: "deviceCategory",
          label: t("fields.deviceCategory"),
          type: "select",
          optionsResource: "device-catalog/categories",
          required: true,
        },
        { name: "logo", label: t("brands.logo"), type: "image" },
        { name: "sortOrder", label: t("fields.sortOrder"), type: "number" },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
        { name: "translations.fr.name", label: t("fields.nameFr"), section: "French Translation" },
      ]}
      columns={[
        { key: "name", label: t("fields.name") },
        { key: "deviceCategory", label: t("fields.colCategory"), render: (r) => r.deviceCategory?.name || "—" },
        { key: "slug", label: t("fields.colSlug") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default BrandsAdmin;