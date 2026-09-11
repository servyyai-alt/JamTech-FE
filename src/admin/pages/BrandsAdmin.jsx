import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const BrandsAdmin = () => (
  <GenericCrudPage
    title="Brands"
    resource="device-catalog/brands"
    description="Manage brands per device category (Apple, Samsung, Dell, etc.)"
    fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug (auto if blank)" },
      {
        name: "deviceCategory",
        label: "Device Category",
        type: "select",
        optionsResource: "device-catalog/categories",
        required: true,
      },
      { name: "logo", label: "Logo URL" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "deviceCategory", label: "Category", render: (r) => r.deviceCategory?.name || "—" },
      { key: "slug", label: "Slug" },
      { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
    ]}
  />
);
export default BrandsAdmin;
