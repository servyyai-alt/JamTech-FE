import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const RepairPricesAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("repairPrices.title")}
      resource="repairs/prices"
      description={t("repairPrices.description")}
      fields={[
        { name: "deviceCategory", label: t("fields.deviceCategory"), type: "select", optionsResource: "device-catalog/categories", required: true },
        { name: "brand", label: t("repairPrices.brandOverride"), type: "select", optionsResource: "device-catalog/brands" },
        { name: "deviceModel", label: t("repairPrices.modelOverride"), type: "select", optionsResource: "device-catalog/models" },
        { name: "deviceVariant", label: t("repairPrices.variantOverride"), type: "select", optionsResource: "device-catalog/variants", optionLabel: (variant) => variant.label },
        { name: "repairService", label: t("repairPrices.repairService"), type: "select", optionsResource: "repairs/services", required: true },
        { name: "regularPrice", label: t("repairPrices.regularPrice"), type: "number", required: true },
        { name: "discountPrice", label: t("repairPrices.discountPrice"), type: "number" },
        { name: "currency", label: t("repairPrices.currency") },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
      ]}
      columns={[
        { key: "regularPrice", label: t("repairPrices.regularPrice"), render: (r) => `€${r.regularPrice}` },
        { key: "discountPrice", label: t("repairPrices.discountPrice"), render: (r) => (r.discountPrice ? `€${r.discountPrice}` : "—") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default RepairPricesAdmin;