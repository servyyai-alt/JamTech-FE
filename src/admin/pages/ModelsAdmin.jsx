import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const ModelsAdmin = () => (
  <GenericCrudPage
    title="Device Models"
    resource="device-catalog/models"
    description="Models belonging to a brand, e.g. iPhone 16 Pro."
    fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug (auto if blank)" },
      { name: "brand", label: "Brand", type: "select", optionsResource: "device-catalog/brands", required: true },
      { name: "deviceCategory", label: "Device Category", type: "select", optionsResource: "device-catalog/categories", required: true },
      { name: "deviceType", label: "Device Type (Laptop/Desktop/AIO)" },
      { name: "image", label: "Image URL" },
      { name: "releaseYear", label: "Release Year", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "deviceType", label: "Type" },
      { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
    ]}
  />
);
export default ModelsAdmin;
