import React, { useEffect, useState } from "react";
import * as adminService from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];

const OrdersAdmin = () => {
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
      showToast("Status updated", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">Orders</h1>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Order #</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Payment</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                  <td className="px-4 py-3">{o.items.length} item(s)</td>
                  <td className="px-4 py-3">{formatPrice(o.totalAmount, o.currency)}</td>
                  <td className="px-4 py-3 capitalize">{o.paymentStatus}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
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
