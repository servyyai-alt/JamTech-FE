import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const VariantsAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("variants.title")}
      resource="device-catalog/variants"
      description={t("variants.description")}
      fields={[
        { name: "deviceModel", label: t("fields.deviceModel"), type: "select", optionsResource: "device-catalog/models", optionLabel: (model) => `${model.brand?.name ? `${model.brand.name} — ` : ""}${model.name}`, required: true },
        { name: "label", label: t("variants.label"), required: true },
        { name: "storage", label: t("variants.storage") },
        { name: "color", label: t("variants.color") },
        { name: "ram", label: t("variants.ram") },
        { name: "processor", label: t("variants.processor") },
        { name: "screenSize", label: t("variants.screenSize") },
        { name: "network", label: t("variants.network") },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
        { name: "translations.fr.label", label: t("variants.labelFr"), section: "French Translation" },
        { name: "translations.fr.storage", label: t("variants.storageFr") },
        { name: "translations.fr.color", label: t("variants.colorFr") },
        { name: "translations.fr.network", label: t("variants.networkFr") },
        { name: "translations.fr.processor", label: t("variants.processorFr") },
        { name: "translations.fr.ram", label: t("variants.ramFr") },
        { name: "translations.fr.screenSize", label: t("variants.screenSizeFr") },
      ]}
      columns={[
        { key: "label", label: t("variants.colLabel") },
        { key: "storage", label: t("variants.storage") },
        { key: "color", label: t("variants.color") },
      ]}
    />
  );
};
export default VariantsAdmin;