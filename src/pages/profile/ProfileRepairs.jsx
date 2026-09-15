import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as bookingService from "../../services/bookingService.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { useTranslation } from "react-i18next";

const ProfileRepairs = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("profile");

  useEffect(() => {
    bookingService.getMyBookings().then((res) => setBookings(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (bookings.length === 0) return <EmptyState title={t("repairs.emptyTitle")} description={t("repairs.emptyDescription")} action={<Link to="/repair" className="btn-primary mt-4">{t("repairs.bookRepair")}</Link>} />;

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <Link key={b._id} to={`/track-repair?bookingNumber=${b.bookingNumber}`} className="card flex items-center justify-between p-4 hover:-translate-y-0.5">
          <div>
            <p className="font-mono text-sm font-bold text-primary-600">{b.bookingNumber}</p>
            <p className="text-xs text-gray-500">{b.brand?.name} {b.deviceModel?.name} — {b.repairService?.name}</p>
          </div>
          <StatusBadge status={b.status} />
        </Link>
      ))}
    </div>
  );
};
export default ProfileRepairs;
