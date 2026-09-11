import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const RepairPricesAdmin = () => (
  <GenericCrudPage
    title="Repair Pricing"
    resource="repairs/prices"
    description="Category > Brand > Model > Variant > Service specific pricing."
    fields={[
      { name: "deviceCategory", label: "Device Category ID", required: true },
      { name: "brand", label: "Brand ID", required: true },
      { name: "deviceModel", label: "Device Model ID", required: true },
      { name: "deviceVariant", label: "Device Variant ID (optional)" },
      { name: "repairService", label: "Repair Service ID", required: true },
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
