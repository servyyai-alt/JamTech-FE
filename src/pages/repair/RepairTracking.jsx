import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as bookingService from "../../services/bookingService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const ALL_STATUSES = [
  "Pending", "Confirmed", "Device Received", "Diagnosis", "Repair In Progress",
  "Awaiting Parts", "Repair Completed", "Ready for Collection", "Out for Delivery", "Delivered",
];

const RepairTracking = () => {
  const [params] = useSearchParams();
  const { t } = useTranslation("repair");
  const { t: tc } = useTranslation("common");
  const { user } = useAuth();
  const [bookingNumber, setBookingNumber] = useState(params.get("bookingNumber") || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const track = async (e) => {
    e?.preventDefault();
    if (!bookingNumber.trim()) return;
    setLoading(true);
    setError(null);
    setBooking(null);
    try {
      const res = await bookingService.trackBooking(bookingNumber.trim());
      setBooking(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t("error.notFound"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get("bookingNumber")) track();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (user) {
      setLoadingBookings(true);
      bookingService.getMyBookings()
        .then((res) => setMyBookings(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingBookings(false));
    }
  }, [user]);

  const currentIndex = booking ? ALL_STATUSES.indexOf(booking.status) : -1;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFAF5]">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-gold-100/30 blur-[80px]" />

      <div className="container-px section-y mx-auto max-w-3xl relative z-10">
        <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink-900">{t("title")}</h1>
        <p className="mb-8 text-center text-gray-500">{t("trackingSubtitle")}</p>

        {/* Search form removed as requested */}

        {loading && <Loader />}
        {error && <ErrorState message={error} />}

        {booking && !loading && (
          <div className="card p-6 mb-8 bg-white border border-gray-100 shadow-sm animate-fade-up">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono font-bold text-primary-600">{booking.bookingNumber}</p>
                <p className="text-sm font-semibold mt-0.5">{booking.device?.brand} {booking.device?.model}</p>
                {booking.device?.customDevice?.issue && (
                  <p className="mt-1 max-w-md text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium text-ink-900">Issue:</span> {booking.device.customDevice.issue}
                  </p>
                )}
              </div>
              <StatusBadge status={booking.status} />
            </div>

            <div className="relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100 md:left-4 md:right-4 md:top-[15px] md:h-0.5 md:w-auto" />
              <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                {ALL_STATUSES.map((status, index) => {
                  const isCompleted = index <= currentIndex;
                  const isActive = index === currentIndex;
                  return (
                    <div key={status} className="relative flex items-center gap-4 md:flex-col md:text-center z-10">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors duration-500 ${isCompleted ? "border-primary-500 text-primary-500 shadow-md" : "border-gray-200 text-gray-300"} ${isActive ? "ring-4 ring-primary-500/20" : ""}`}>
                        <Check size={16} className={isCompleted ? "opacity-100" : "opacity-0"} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isCompleted ? "text-ink-900" : "text-gray-400"}`}>{t(`status.${status}`)}</p>
                        {isActive && booking.statusUpdatedAt && (
                          <p className="text-xs font-medium text-primary-600 mt-1">
                            {new Date(booking.statusUpdatedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!booking && !loading && user && (
          <div className="mx-auto max-w-2xl mt-12 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h3 className="mb-4 font-display text-xl font-semibold text-ink-900">Your Recent Quotes & Repairs</h3>
            {loadingBookings ? (
              <Loader />
            ) : myBookings.length > 0 ? (
              <div className="space-y-3">
                {myBookings.map((b) => (
                  <button key={b._id} onClick={() => { setBookingNumber(b.bookingNumber); setTimeout(() => track(), 100); }} className="w-full text-left card flex items-center justify-between p-5 hover:-translate-y-1 hover:shadow-md transition-all border border-gray-100 bg-white">
                    <div>
                      <p className="font-mono text-sm font-bold text-primary-600">{b.bookingNumber}</p>
                      <p className="text-sm font-medium text-ink-900 mt-1">{b.device?.brand} {b.device?.model || "Custom Device"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <StatusBadge status={b.status} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">You haven't requested any repair quotes yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default RepairTracking;
