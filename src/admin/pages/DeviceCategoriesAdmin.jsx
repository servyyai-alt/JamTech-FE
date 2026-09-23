import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const DeviceCategoriesAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("deviceCategories.title")}
      resource="device-catalog/categories"
      description={t("deviceCategories.description")}
      fields={[
        { name: "name", label: t("fields.name"), required: true },
        { name: "slug", label: t("fields.slug") },
        { name: "icon", label: t("fields.icon") },
        { name: "image", label: t("fields.image"), type: "image" },
        { name: "description", label: t("fields.description"), type: "textarea" },
        { name: "sortOrder", label: t("fields.sortOrder"), type: "number" },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
        { name: "translations.fr.name", label: t("fields.nameFr"), section: "French Translation" },
        { name: "translations.fr.description", label: t("fields.descriptionFr"), type: "textarea" },
      ]}
      columns={[
        { key: "name", label: t("fields.name") },
        { key: "slug", label: t("fields.colSlug") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default DeviceCategoriesAdmin;