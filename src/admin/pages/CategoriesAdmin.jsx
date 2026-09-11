import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const CategoriesAdmin = () => (
  <GenericCrudPage
    title="Product Categories"
    resource="categories"
    description="E-commerce categories (Phone Cases, Chargers, Power Banks, etc.)"
    fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug (auto if blank)" },
      { name: "icon", label: "Icon (lucide name)" },
      { name: "image", label: "Image URL" },
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
export default CategoriesAdmin;
