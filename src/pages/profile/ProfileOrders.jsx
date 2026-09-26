import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Wallet, Truck, ChevronRight, ImageOff } from "lucide-react";
import * as orderService from "../../services/orderService.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { useTranslation } from "react-i18next";
import "./orders-page.css";

const ACTIVE_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Out for Delivery"];
const MAX_THUMBS = 3;

const ProfileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("profile");

  useEffect(() => {
    orderService.getMyOrders().then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const currency = orders[0]?.currency || "EUR";
    const spent = orders
      .filter((o) => o.status !== "Cancelled" && o.status !== "Returned")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length;
    return { currency, spent, active };
  }, [orders]);

  if (loading) return <Loader />;
  if (orders.length === 0) return <EmptyState title={t("orders.emptyTitle")} description={t("orders.emptyDescription")} />;

  return (
    <div className="ord">
      <div className="ord-summary">
        <div className="ord-summary__cell">
          <span className="ord-summary__label"><Package size={12} /> {t("orders.summary.placed")}</span>
          <span className="ord-summary__value">{orders.length}</span>
        </div>
        <div className="ord-summary__cell">
          <span className="ord-summary__label"><Truck size={12} /> {t("orders.summary.active")}</span>
          <span className="ord-summary__value">{summary.active}</span>
        </div>
        <div className="ord-summary__cell">
          <span className="ord-summary__label"><Wallet size={12} /> {t("orders.summary.spent")}</span>
          <span className="ord-summary__value">{formatPrice(summary.spent, summary.currency)}</span>
        </div>
      </div>

      <div className="ord-list">
        {orders.map((o, index) => {
          const shown = (o.items || []).slice(0, MAX_THUMBS);
          const hiddenCount = (o.items || []).length - shown.length;
          return (
            <Link key={o._id} to={`/profile/orders/${o._id}`} className="ord-card" style={{ "--i": index }}>
              <span className="ord-card__bar" aria-hidden="true" />

              <span className="ord-thumbs">
                {shown.map((item, i) => (
                  <span className={`ord-thumb ${item.image ? "" : "ord-thumb--empty"}`} key={`${item.product}-${i}`}>
                    {item.image
                      ? <img src={item.image} alt={item.title} loading="lazy" />
                      : <ImageOff size={18} aria-hidden="true" />}
                    {i === shown.length - 1 && hiddenCount > 0 && <span className="ord-thumb__more">+{hiddenCount}</span>}
                  </span>
                ))}
              </span>

              <span className="ord-card__body">
                <span className="ord-card__number">{o.orderNumber}</span>
                <span className="ord-card__meta">
                  <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                  <span>{t("orders.itemCount", { count: o.items.length })}</span>
                </span>
                <span className="ord-card__titles">
                  {(o.items || []).map((item) => item.title).join(", ")}
                </span>
              </span>

              <span className="ord-card__side">
                <span className="ord-card__badge"><StatusBadge status={o.status} /></span>
                <span className="ord-card__total">{formatPrice(o.totalAmount, o.currency)}</span>
                <span className="ord-card__arrow" aria-hidden="true"><ChevronRight size={16} /></span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default ProfileOrders;
