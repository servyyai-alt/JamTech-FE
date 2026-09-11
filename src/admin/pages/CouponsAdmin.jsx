import React from "react";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const CouponsAdmin = () => (
  <GenericCrudPage
    title="Coupons"
    resource="coupons"
    description="Discount codes for the e-commerce checkout."
    fields={[
      { name: "code", label: "Code", required: true },
      { name: "description", label: "Description" },
      { name: "discountType", label: "Discount Type", type: "select", required: true, options: [{ value: "percentage", label: "Percentage" }, { value: "fixed", label: "Fixed Amount" }] },
      { name: "discountValue", label: "Discount Value", type: "number", required: true },
      { name: "minOrderAmount", label: "Min Order Amount", type: "number" },
      { name: "maxDiscountAmount", label: "Max Discount Amount", type: "number" },
      { name: "usageLimit", label: "Usage Limit", type: "number" },
      { name: "validUntil", label: "Valid Until (YYYY-MM-DD)", required: true },
      { name: "isActive", label: "Active", type: "checkbox" },
    ]}
    columns={[
      { key: "code", label: "Code" },
      { key: "discountType", label: "Type" },
      { key: "discountValue", label: "Value" },
      { key: "usedCount", label: "Used" },
      { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
    ]}
  />
);
export default CouponsAdmin;
