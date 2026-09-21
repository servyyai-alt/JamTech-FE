import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as orderService from "../../services/orderService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const OrderTracking = () => {
  const { t } = useTranslation("cart");
  const [params] = useSearchParams();
  const { user } = useAuth();
  const [orderNumber, setOrderNumber] = useState(params.get("orderNumber") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const track = async (e) => {
    e?.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true); setError(null); setOrder(null);
    try {
      const res = await orderService.trackOrder(orderNumber.trim());
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t("tracking.notFound"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (params.get("orderNumber")) track(); /* eslint-disable-next-line */ }, []);

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      orderService.getMyOrders()
        .then((res) => setMyOrders(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFAF5]">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-gold-100/30 blur-[80px]" />

      <div className="container-px section-y mx-auto max-w-3xl relative z-10">
        <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink-900">{t("tracking.title")}</h1>
        <p className="mb-8 text-center text-gray-500">{t("tracking.description")}</p>
        {/* Search form removed as requested */}

        {loading && <Loader />}
        {error && <ErrorState message={error} />}

        {order && (
          <div className="card p-6 mb-8 bg-white shadow-sm">
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
              <span>{t("summary.total")}</span><span>{formatPrice(order.totalAmount, order.currency)}</span>
            </div>
          </div>
        )}

        {!order && !loading && user && (
          <div className="mx-auto max-w-2xl mt-12 animate-fade-up">
            <h3 className="mb-4 font-display text-xl font-semibold text-ink-900">Your Recent Orders</h3>
            {loadingOrders ? (
              <Loader />
            ) : myOrders.length > 0 ? (
              <div className="space-y-3">
                {myOrders.map((o) => (
                  <Link key={o._id} to={`/track-order?orderNumber=${o.orderNumber}`} onClick={() => { setOrderNumber(o.orderNumber); setTimeout(() => track(), 100); }} className="card flex items-center justify-between p-5 hover:-translate-y-1 hover:shadow-md transition-all border border-gray-100 bg-white">
                    <div>
                      <p className="font-mono text-sm font-bold text-primary-600">{o.orderNumber}</p>
                      <p className="text-sm font-medium text-ink-900 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{o.items?.length || 0} items</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-ink-900">{formatPrice(o.totalAmount, o.currency)}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">You haven't placed any shop orders yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default OrderTracking;
