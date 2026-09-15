import React from "react";
import { Link, useLocation } from "react-router-dom";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const PaymentFailed = () => {
  const { t } = useTranslation("cart");
  const { state } = useLocation();
  return (
    <div className="container-px section-y mx-auto max-w-lg text-center">
      <XCircle className="mx-auto mb-4 text-red-500" size={64} />
      <h1 className="font-display text-3xl font-bold text-ink-900">{t("payment.failed.title")}</h1>
      <p className="mt-2 text-gray-500">
        {t("payment.failed.messageStart")}{" "}
        {state?.orderNumber && <span className="font-mono font-semibold">{state.orderNumber}</span>}{" "}
        {t("payment.failed.messageEnd")}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/checkout" className="btn-primary">{t("payment.failed.tryAgain")}</Link>
        <Link to="/contact" className="btn-secondary">{t("payment.failed.contactSupport")}</Link>
      </div>
    </div>
  );
};
export default PaymentFailed;
