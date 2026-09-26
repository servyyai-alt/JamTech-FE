import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wrench, Truck, Wallet, Package, ChevronRight, CalendarDays, Clock,
  Store, Home, FileQuestion, Smartphone, Tablet, Laptop, Gamepad2,
} from "lucide-react";
import * as bookingService from "../../services/bookingService.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { useTranslation } from "react-i18next";
import { REPAIR_FLOW, getRepairStep } from "../../constants/repairFlow.js";
import "./repairs-page.css";

const CATEGORY_ICONS = { Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, "Gaming Devices": Gamepad2 };
const METHOD_ICONS = { "Store Visit": Store, "Pickup & Delivery": Truck, "Mail-in Repair": Package, "On-site Repair": Home };
const DONE_STATUSES = ["Repair Completed", "Ready for Collection", "Out for Delivery", "Delivered"];

const ProfileRepairs = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("profile");
  const { t: tr } = useTranslation("repair");

  useEffect(() => {
    bookingService.getMyBookings().then((res) => setBookings(res.data || [])).finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const active = bookings.filter((b) => b.status !== "Cancelled" && !DONE_STATUSES.includes(b.status)).length;
    const done = bookings.filter((b) => DONE_STATUSES.includes(b.status)).length;
    const spent = bookings.filter((b) => b.status !== "Cancelled").reduce((sum, b) => sum + (b.price || 0), 0);
    return { active, done, spent };
  }, [bookings]);

  if (loading) return <Loader />;
  if (bookings.length === 0) return <EmptyState title={t("repairs.emptyTitle")} description={t("repairs.emptyDescription")} action={<Link to="/repair" className="btn-primary mt-4">{t("repairs.bookRepair")}</Link>} />;

  return (
    <div className="rep">
      <div className="rep-summary">
        <div className="rep-summary__cell">
          <span className="rep-summary__label"><Wrench size={12} /> {t("repairs.summary.bookings")}</span>
          <span className="rep-summary__value">{bookings.length}</span>
        </div>
        <div className="rep-summary__cell">
          <span className="rep-summary__label"><Truck size={12} /> {t("repairs.summary.active")}</span>
          <span className="rep-summary__value">{summary.active}</span>
        </div>
        <div className="rep-summary__cell">
          <span className="rep-summary__label"><Package size={12} /> {t("repairs.summary.done")}</span>
          <span className="rep-summary__value">{summary.done}</span>
        </div>
        <div className="rep-summary__cell">
          <span className="rep-summary__label"><Wallet size={12} /> {t("repairs.summary.spent")}</span>
          <span className="rep-summary__value">{formatPrice(summary.spent, "EUR")}</span>
        </div>
      </div>

      <div className="rep-list">
        {bookings.map((b, index) => {
          const device = b.isManualQuote
            ? [b.customDevice?.brand, b.customDevice?.model].filter(Boolean).join(" ")
            : [b.brand?.name, b.deviceModel?.name].filter(Boolean).join(" ");
          const service = b.isManualQuote ? b.customDevice?.issue : b.repairService?.name;
          const DeviceIcon = CATEGORY_ICONS[b.deviceCategory?.name] || CATEGORY_ICONS[b.customDevice?.category] || Smartphone;
          const MethodIcon = METHOD_ICONS[b.serviceMethod] || Store;
          const { index: step, ended, complete } = getRepairStep(b.status);
          const lastNote = [...(b.statusHistory || [])].reverse().find((h) => h.note);
          const lastUpdate = (b.statusHistory || [])[b.statusHistory.length - 1]?.changedAt;

          return (
            <Link
              key={b._id}
              to={`/track-repair?bookingNumber=${b.bookingNumber}`}
              className={`rep-card ${b.isManualQuote ? "rep-card--quote" : ""}`}
              style={{ "--i": index }}
            >
              <span className="rep-card__bar" aria-hidden="true" />

              <span className="rep-device">
                {b.deviceModel?.image
                  ? <img src={b.deviceModel.image} alt={device} loading="lazy" />
                  : <DeviceIcon size={26} aria-hidden="true" />}
                {b.isManualQuote && <span className="rep-device__tag" title={t("repairs.quoteBadge")}><FileQuestion size={12} /></span>}
                {b.brand?.logo && <img className="rep-device__logo" src={b.brand.logo} alt={b.brand.name} loading="lazy" />}
              </span>

              <span className="rep-card__body">
                <span className="rep-card__number">{b.bookingNumber}</span>
                <span className="rep-card__device-name">
                  {device || t("repairs.customDevice")}
                  {b.deviceVariant?.label && <span className="rep-card__variant">{b.deviceVariant.label}</span>}
                </span>
                {service && <span className="rep-card__service"><Wrench size={14} /> {service}</span>}

                <span className="rep-chips">
                  {b.isManualQuote
                    ? <span className="rep-chip rep-chip--quote"><FileQuestion size={12} /> {t("repairs.quoteBadge")}</span>
                    : b.deviceCategory?.name && <span className="rep-chip"><DeviceIcon size={12} /> {b.deviceCategory.name}</span>}
                  {b.serviceMethod && <span className="rep-chip"><MethodIcon size={12} /> {tr(`methods.${b.serviceMethod}`, { defaultValue: b.serviceMethod })}</span>}
                  {b.preferredDate && <span className="rep-chip"><CalendarDays size={12} /> {new Date(b.preferredDate).toLocaleDateString()}</span>}
                  {b.preferredTime && <span className="rep-chip"><Clock size={12} /> {b.preferredTime}</span>}
                </span>

                {lastNote && <span className="rep-note">{lastNote.note}</span>}

                <span className={`rep-progress ${ended ? "rep-progress--ended" : ""}`}>
                  <span className="rep-progress__head">
                    <span className="rep-progress__step">
                      {ended ? t("repairs.cancelled") : t("repairs.step", { current: step + 1, total: REPAIR_FLOW.length })}
                    </span>
                    {lastUpdate && <span>{t("repairs.lastUpdate")} {new Date(lastUpdate).toLocaleDateString()}</span>}
                  </span>
                  <span className="rep-progress__track">
                    {REPAIR_FLOW.map((status, i) => (
                      <span
                        key={status}
                        className={`rep-progress__seg ${!ended && i <= step ? "is-done" : ""} ${!ended && !complete && i === step ? "is-current" : ""}`}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                </span>
              </span>

              <span className="rep-card__side">
                <span className="rep-card__badge"><StatusBadge status={b.status} /></span>
                {!b.isManualQuote && <span className="rep-card__price">{formatPrice(b.price, b.repairPrice?.currency || "EUR")}</span>}
                <span className="rep-card__foot">
                  <span className="rep-card__arrow" aria-hidden="true"><ChevronRight size={16} /></span>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default ProfileRepairs;
