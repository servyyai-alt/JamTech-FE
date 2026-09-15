import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as orderService from "../../services/orderService.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { useTranslation } from "react-i18next";

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("profile");

  useEffect(() => {
    orderService.getMyOrders().then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (orders.length === 0) return <EmptyState title={t("orders.emptyTitle")} description={t("orders.emptyDescription")} />;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link key={o._id} to={`/profile/orders/${o._id}`} className="card flex items-center justify-between p-4 hover:-translate-y-0.5">
          <div>
            <p className="font-mono text-sm font-bold text-primary-600">{o.orderNumber}</p>
            <p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString()} · {t("orders.itemCount", { count: o.items.length })}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold">{formatPrice(o.totalAmount, o.currency)}</span>
            <StatusBadge status={o.status} />
          </div>
        </Link>
      ))}
    </div>
  );
};
export default ProfileOrders;
