import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const VariantsAdmin = () => (
  <GenericCrudPage
    title="Device Variants / Configurations"
    resource="device-catalog/variants"
    description="Storage, color, RAM, processor combinations for a device model."
    fields={[
      { name: "deviceModel", label: "Device Model", type: "select", optionsResource: "device-catalog/models", optionLabel: (model) => `${model.brand?.name ? `${model.brand.name} — ` : ""}${model.name}`, required: true },
      { name: "label", label: "Label (e.g. 256GB - Titanium)", required: true },
      { name: "storage", label: "Storage" },
      { name: "color", label: "Color" },
      { name: "ram", label: "RAM" },
      { name: "processor", label: "Processor" },
      { name: "screenSize", label: "Screen Size" },
      { name: "network", label: "Network" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "label", label: "Label" },
      { key: "storage", label: "Storage" },
      { key: "color", label: "Color" },
    ]}
  />
);
export default VariantsAdmin;
