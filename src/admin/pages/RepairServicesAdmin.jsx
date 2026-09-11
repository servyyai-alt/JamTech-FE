import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const RepairServicesAdmin = () => (
  <GenericCrudPage
    title="Repair Services"
    resource="repairs/services"
    description="Screen replacement, battery replacement, and other repair types."
    fields={[
      { name: "name", label: "Name", required: true },
      { name: "slug", label: "Slug (auto if blank)" },
      { name: "icon", label: "Icon (lucide name)" },
      { name: "image", label: "Image URL" },
      { name: "shortDescription", label: "Short Description" },
      { name: "fullDescription", label: "Full Description", type: "textarea" },
      { name: "estimatedTime", label: "Estimated Time (e.g. 45-60 min)" },
      { name: "warranty", label: "Warranty (e.g. 90 days)" },
      { name: "sortOrder", label: "Sort Order", type: "number" },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "name", label: "Name" },
      { key: "estimatedTime", label: "Est. Time" },
      { key: "warranty", label: "Warranty" },
      { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
    ]}
  />
);
export default RepairServicesAdmin;
