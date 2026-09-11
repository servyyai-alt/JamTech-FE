import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const RepairPricesAdmin = () => (
  <GenericCrudPage
    title="Repair Pricing"
    resource="repairs/prices"
    description="Set one default price per category and repair service. Brand, model, and variant fields are optional price overrides."
    fields={[
      { name: "deviceCategory", label: "Device Category", type: "select", optionsResource: "device-catalog/categories", required: true },
      { name: "brand", label: "Brand override (optional)", type: "select", optionsResource: "device-catalog/brands" },
      { name: "deviceModel", label: "Model override (optional)", type: "select", optionsResource: "device-catalog/models" },
      { name: "deviceVariant", label: "Variant override (optional)", type: "select", optionsResource: "device-catalog/variants", optionLabel: (variant) => variant.label },
      { name: "repairService", label: "Repair Service", type: "select", optionsResource: "repairs/services", required: true },
      { name: "regularPrice", label: "Regular Price", type: "number", required: true },
      { name: "discountPrice", label: "Discount Price", type: "number" },
      { name: "currency", label: "Currency (default EUR)" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "regularPrice", label: "Regular Price", render: (r) => `€${r.regularPrice}` },
      { key: "discountPrice", label: "Discount Price", render: (r) => (r.discountPrice ? `€${r.discountPrice}` : "—") },
      { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
    ]}
  />
);
export default RepairPricesAdmin;
