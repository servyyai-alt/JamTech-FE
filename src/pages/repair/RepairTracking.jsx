import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as bookingService from "../../services/bookingService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { Search } from "lucide-react";

const ALL_STATUSES = [
  "Pending", "Confirmed", "Device Received", "Diagnosis", "Repair In Progress",
  "Awaiting Parts", "Repair Completed", "Ready for Collection", "Out for Delivery", "Delivered",
];

const RepairTracking = () => {
  const [params] = useSearchParams();
  const [bookingNumber, setBookingNumber] = useState(params.get("bookingNumber") || "");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setError(err.response?.data?.message || "Booking not found. Please check your booking number.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get("bookingNumber")) track();
    // eslint-disable-next-line
  }, []);

  const currentIndex = booking ? ALL_STATUSES.indexOf(booking.status) : -1;

  return (
    <div className="container-px section-y mx-auto max-w-3xl">
      <h1 className="mb-2 text-center font-display text-3xl font-bold text-ink-900">Track Your Repair</h1>
      <p className="mb-8 text-center text-gray-500">Enter your booking number to see live status.</p>

      <form onSubmit={track} className="mx-auto mb-10 flex max-w-md gap-2">
        <input value={bookingNumber} onChange={(e) => setBookingNumber(e.target.value)} placeholder="e.g. REP-2026-00001" className="input flex-1" />
        <button className="btn-primary !px-5"><Search size={18} /></button>
      </form>

      {loading && <Loader />}
      {error && <ErrorState message={error} />}

      {booking && !loading && (
        <div className="card p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono font-bold text-primary-600">{booking.bookingNumber}</p>
              <p className="text-sm text-gray-500">{booking.brand?.name} {booking.deviceModel?.name} — {booking.repairService?.name}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          {booking.status !== "Cancelled" && (
            <div className="mb-6 flex overflow-x-auto pb-2">
              {ALL_STATUSES.map((s, i) => (
                <div key={s} className="flex min-w-[110px] flex-col items-center">
                  <div className="flex items-center w-full">
                    <div className={`h-0.5 flex-1 ${i === 0 ? "invisible" : i <= currentIndex ? "bg-primary-600" : "bg-gray-200"}`} />
                    <div className={`h-3 w-3 shrink-0 rounded-full ${i <= currentIndex ? "bg-primary-600" : "bg-gray-200"}`} />
                    <div className={`h-0.5 flex-1 ${i === ALL_STATUSES.length - 1 ? "invisible" : i < currentIndex ? "bg-primary-600" : "bg-gray-200"}`} />
                  </div>
                  <span className={`mt-2 text-center text-[10px] font-medium ${i <= currentIndex ? "text-ink-900" : "text-gray-400"}`}>{s}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
            <div><span className="text-gray-500">Service Method</span><p className="font-medium">{booking.serviceMethod}</p></div>
            <div><span className="text-gray-500">Preferred Date</span><p className="font-medium">{new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}</p></div>
            <div><span className="text-gray-500">Price</span><p className="font-medium">€{booking.price}</p></div>
            <div><span className="text-gray-500">Payment Status</span><p className="font-medium capitalize">{booking.paymentStatus}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
export default RepairTracking;
