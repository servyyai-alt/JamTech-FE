import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const PaymentSuccess = () => {
  const { t } = useTranslation("cart");
  const { state } = useLocation();
  return (
    <div className="container-px section-y mx-auto max-w-lg text-center">
      <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={64} />
      <h1 className="font-display text-3xl font-bold text-ink-900">{t("payment.success.title")}</h1>
      <p className="mt-2 text-gray-500">
        {t("payment.success.messageStart")}{" "}
        {state?.orderNumber && <span className="font-mono font-semibold">{state.orderNumber}</span>}{" "}
        {t("payment.success.messageEnd")}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/profile/orders" className="btn-primary">{t("payment.success.viewOrders")}</Link>
        <Link to="/shop" className="btn-secondary">{t("payment.success.continueShopping")}</Link>
      </div>
    </div>
  );
};
export default PaymentSuccess;
