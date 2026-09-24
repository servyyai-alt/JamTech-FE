import React, { useEffect, useState } from "react";
import * as adminService from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];

const OrdersAdmin = () => {
  const { t } = useTranslation("admin");
  const { t: tc } = useTranslation("common");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminService.getAllOrders().then((res) => setOrders(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateOrderStatus(id, status);
      showToast(t("orders.toastStatusUpdated"), "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t("orders.toastUpdateFailed"), "error");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">{t("orders.title")}</h1>
      {orders.length === 0 ? (
        <EmptyState title={t("orders.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("orders.orderNumber")}</th>
                <th className="px-4 py-3 font-semibold">{t("orders.items")}</th>
                <th className="px-4 py-3 font-semibold">{t("orders.total")}</th>
                <th className="px-4 py-3 font-semibold">{t("orders.payment")}</th>
                <th className="px-4 py-3 font-semibold">{t("orders.status")}</th>
                <th className="px-4 py-3 font-semibold">{t("orders.update")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {o.items?.map((item, idx) => (
                        <span key={idx} className="text-xs text-gray-600 line-clamp-1" title={item.title}>
                          {item.quantity}x {item.title || "Product"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(o.totalAmount, o.currency)}</td>
                  <td className="px-4 py-3 capitalize">{o.paymentStatus}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{tc(`statuses.${s}`, { defaultValue: s })}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
