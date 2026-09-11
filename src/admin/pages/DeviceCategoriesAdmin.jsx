import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const DeviceCategoriesAdmin = () => (
  <GenericCrudPage
    title="Device Categories"
    resource="device-catalog/categories"
    description="Smartphones, Tablets, Computers, Gaming Devices."
    fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug (auto if blank)" },
      { name: "icon", label: "Icon (lucide name)" },
      { name: "image", label: "Image URL" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
    ]}
  />
);
export default DeviceCategoriesAdmin;
