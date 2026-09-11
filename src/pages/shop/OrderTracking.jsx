import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as orderService from "../../services/orderService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { Search } from "lucide-react";

const OrderTracking = () => {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get("orderNumber") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const track = async (e) => {
    e?.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true); setError(null); setOrder(null);
    try {
      const res = await orderService.trackOrder(orderNumber.trim());
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (params.get("orderNumber")) track(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="container-px section-y mx-auto max-w-3xl">
      <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink-900">Track Your Order</h1>
      <p className="mb-8 text-center text-gray-500">Enter your order number to see status.</p>
      <form onSubmit={track} className="mx-auto mb-10 flex max-w-md gap-2">
        <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="e.g. ORD-2026-00001" className="input flex-1" />
        <button className="btn-primary !px-5"><Search size={18} /></button>
      </form>

      {loading && <Loader />}
      {error && <ErrorState message={error} />}

      {order && (
        <div className="card p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono font-bold text-primary-600">{order.orderNumber}</p>
            <StatusBadge status={order.status} />
          </div>
          <div className="mb-4 space-y-2">
            {order.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm"><span>{it.title} × {it.quantity}</span><span>{formatPrice(it.price * it.quantity)}</span></div>
            ))}
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 font-semibold">
            <span>Total</span><span>{formatPrice(order.totalAmount, order.currency)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default OrderTracking;
