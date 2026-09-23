import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const CategoriesAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("categories.title")}
      resource="categories"
      description={t("categories.description")}
      fields={[
        { name: "name", label: t("fields.name"), required: true },
        { name: "slug", label: t("fields.slug") },
        { name: "icon", label: t("fields.icon") },
        { name: "image", label: t("fields.image"), type: "image" },
        { name: "sortOrder", label: t("fields.sortOrder"), type: "number" },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
        { name: "translations.fr.name", label: t("fields.nameFr"), section: "French Translation" },
        { name: "translations.fr.description", label: t("fields.descriptionFr") },
      ]}
      columns={[
        { key: "name", label: t("fields.name") },
        { key: "slug", label: t("fields.colSlug") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default CategoriesAdmin;