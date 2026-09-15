import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as orderService from "../../services/orderService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { useTranslation } from "react-i18next";

const ProfileOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation("profile");

  useEffect(() => {
    orderService.getOrder(id).then((res) => setOrder(res.data)).catch(() => setError(t("orderDetails.notFound"))).finally(() => setLoading(false));
  }, [id, t]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono font-bold text-primary-600">{order.orderNumber}</p>
        <StatusBadge status={order.status} />
      </div>
      <div className="mb-4 space-y-2">
        {order.items.map((it, i) => (
          <div key={i} className="flex justify-between text-sm"><span>{it.title}{it.variantLabel ? ` (${it.variantLabel})` : ""} × {it.quantity}</span><span>{formatPrice(it.price * it.quantity)}</span></div>
        ))}
      </div>
      <div className="space-y-1 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-500"><span>{t("orderDetails.subtotal")}</span><span>{formatPrice(order.subtotal)}</span></div>
        <div className="flex justify-between text-gray-500"><span>{t("orderDetails.shipping")}</span><span>{formatPrice(order.shippingCost)}</span></div>
        <div className="flex justify-between text-gray-500"><span>{t("orderDetails.tax")}</span><span>{formatPrice(order.taxAmount)}</span></div>
        {order.discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>{t("orderDetails.discount")}</span><span>-{formatPrice(order.discountAmount)}</span></div>}
        <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold"><span>{t("orderDetails.total")}</span><span>{formatPrice(order.totalAmount, order.currency)}</span></div>
      </div>
      {order.shippingAddress && (
        <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
          <p className="mb-1 font-semibold text-ink-900">{t("orderDetails.shippingAddress")}</p>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        </div>
      )}
    </div>
  );
};
export default ProfileOrderDetails;
