import React from "react";
import { useTranslation } from "react-i18next";
import GenericCrudPage from "../components/GenericCrudPage.jsx";

const CouponsAdmin = () => {
  const { t } = useTranslation("admin");
  return (
    <GenericCrudPage
      title={t("coupons.title")}
      resource="coupons"
      description={t("coupons.description")}
      fields={[
        { name: "code", label: t("coupons.code"), required: true },
        { name: "description", label: t("fields.description") },
        { name: "discountType", label: t("coupons.discountType"), type: "select", required: true, options: [{ value: "percentage", label: t("coupons.percentage") }, { value: "fixed", label: t("coupons.fixedAmount") }] },
        { name: "discountValue", label: t("coupons.discountValue"), type: "number", required: true },
        { name: "minOrderAmount", label: t("coupons.minOrderAmount"), type: "number" },
        { name: "maxDiscountAmount", label: t("coupons.maxDiscountAmount"), type: "number" },
        { name: "usageLimit", label: t("coupons.usageLimit"), type: "number" },
        { name: "validUntil", label: t("coupons.validUntil"), required: true },
        { name: "isActive", label: t("fields.active"), type: "checkbox" },
      ]}
      columns={[
        { key: "code", label: t("coupons.code") },
        { key: "discountType", label: t("coupons.type") },
        { key: "discountValue", label: t("coupons.value") },
        { key: "usedCount", label: t("coupons.used") },
        { key: "isActive", label: t("fields.active"), render: (r) => (r.isActive ? t("yes") : t("no")) },
      ]}
    />
  );
};
export default CouponsAdmin;