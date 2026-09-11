import React, { useEffect, useState } from "react";
import * as adminService from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

const STATUSES = [
  "Pending", "Confirmed", "Device Received", "Diagnosis", "Repair In Progress",
  "Awaiting Parts", "Repair Completed", "Ready for Collection", "Out for Delivery", "Delivered", "Cancelled",
];

const BookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminService.getAllBookings().then((res) => setBookings(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateBookingStatus(id, status);
      showToast("Status updated", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">Repair Bookings</h1>
      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Booking #</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Device</th>
                <th className="px-4 py-3 font-semibold">Repair</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.bookingNumber}</td>
                  <td className="px-4 py-3">{b.customerDetails?.name}<br /><span className="text-xs text-gray-400">{b.customerDetails?.email}</span></td>
                  <td className="px-4 py-3">
                    {b.isManualQuote ? `${b.customDevice?.brand} ${b.customDevice?.model}` : `${b.brand?.name} ${b.deviceModel?.name}`}
                    {b.isManualQuote && <span className="mt-1 block max-w-xs text-xs text-gray-500">{b.customDevice?.issue}</span>}
                  </td>
                  <td className="px-4 py-3">{b.isManualQuote ? "Manual quote" : b.repairService?.name}</td>
                  <td className="px-4 py-3">{b.isManualQuote ? "Quote pending" : `€${b.price}`}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
                    >
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

export default BookingsAdmin;
