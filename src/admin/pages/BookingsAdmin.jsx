import React, { useEffect, useState } from "react";
import { Eye, X, Calendar, Clock, User, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("admin");
  const { t: tc } = useTranslation("common");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminService.getAllBookings().then((res) => setBookings(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    if (selected) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [selected]);

  const handleStatusChange = async (id, status) => {
    try {
      await adminService.updateBookingStatus(id, status);
      showToast(t("bookings.toastStatusUpdated"), "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t("bookings.toastUpdateFailed"), "error");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">{t("bookings.title")}</h1>
      {bookings.length === 0 ? (
        <EmptyState title={t("bookings.empty")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("bookings.bookingNumber")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.customer")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.device")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.repair")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.appointment")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.price")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.status")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.update")}</th>
                <th className="px-4 py-3 font-semibold">{t("bookings.view")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{b.bookingNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{b.customerDetails?.name}</div>
                    <div className="text-xs text-gray-500">{b.customerDetails?.email}</div>
                    {b.customerDetails?.phone && <div className="text-xs text-gray-500">{b.customerDetails?.phone}</div>}
                    {b.customerDetails?.address && <div className="text-xs text-gray-500">{b.customerDetails?.address}{b.customerDetails?.city ? `, ${b.customerDetails.city}` : ""}{b.customerDetails?.postalCode ? ` ${b.customerDetails.postalCode}` : ""}</div>}
                    {b.customerDetails?.country && <div className="text-xs text-gray-500">{b.customerDetails.country}</div>}
                  </td>
                  <td className="px-4 py-3">
                    {b.isManualQuote ? `${b.customDevice?.brand} ${b.customDevice?.model}` : `${b.brand?.name} ${b.deviceModel?.name}`}
                  </td>
                  <td className="px-4 py-3">{b.isManualQuote ? t("bookings.manualQuote") : b.repairService?.name}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-700">{b.serviceMethod}</div>
                    <div className="text-xs text-gray-500">{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : ""}{b.preferredTime ? ` ${t("bookings.at", { time: b.preferredTime })}` : ""}</div>
                  </td>
                  <td className="px-4 py-3">{b.isManualQuote ? t("bookings.quotePending") : `€${b.price}`}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{tc(`statuses.${s}`, { defaultValue: s })}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(b)} className="rounded-lg p-2 text-gray-500 transition hover:bg-primary-50 hover:text-primary-600" title={t("bookings.viewDetails")} aria-label={t("bookings.viewDetails")}>
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-premium" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">{t("bookings.modalTitle", { bookingNumber: selected.bookingNumber })}</h3>
                <div className="mt-1"><StatusBadge status={selected.status} /></div>
              </div>
              <button onClick={() => setSelected(null)}><X size={18} /></button>
            </div>

            <div className="grid gap-5">
              <section className="rounded-xl border border-gray-100 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-ink-900"><User size={16} className="text-primary-600" /> {t("bookings.customerDetails")}</h4>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-xs text-gray-400">{t("bookings.name")}</dt><dd className="font-medium">{selected.customerDetails?.name}</dd></div>
                  <div><dt className="text-xs text-gray-400">{t("bookings.email")}</dt><dd className="flex items-center gap-1">{selected.customerDetails?.email}</dd></div>
                  <div><dt className="text-xs text-gray-400">{t("bookings.phone")}</dt><dd className="flex items-center gap-1">{selected.customerDetails?.phone}</dd></div>
                  {selected.customerDetails?.address && <div className="sm:col-span-2"><dt className="text-xs text-gray-400">{t("bookings.address")}</dt><dd className="flex items-center gap-1">{selected.customerDetails.address}{selected.customerDetails.city ? `, ${selected.customerDetails.city}` : ""}{selected.customerDetails.postalCode ? ` ${selected.customerDetails.postalCode}` : ""}{selected.customerDetails.country ? `, ${selected.customerDetails.country}` : ""}</dd></div>}
                </dl>
              </section>

              <section className="rounded-xl border border-gray-100 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-ink-900"><Wrench size={16} className="text-primary-600" /> {t("bookings.deviceAndRepair")}</h4>
                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  {selected.isManualQuote ? (
                    <>
                      <div><dt className="text-xs text-gray-400">{t("bookings.device")}</dt><dd className="font-medium">{selected.customDevice?.brand} {selected.customDevice?.model}{selected.customDevice?.variant ? ` (${selected.customDevice.variant})` : ""}</dd></div>
                      {selected.customDevice?.category && <div><dt className="text-xs text-gray-400">{t("bookings.category")}</dt><dd>{selected.customDevice.category}</dd></div>}
                      <div><dt className="text-xs text-gray-400">{t("bookings.repair")}</dt><dd>{t("bookings.manualQuote")}</dd></div>
                      <div className="sm:col-span-2"><dt className="text-xs text-gray-400">{t("bookings.issue")}</dt><dd className="whitespace-pre-wrap break-words">{selected.customDevice?.issue}</dd></div>
                    </>
                  ) : (
                    <>
                      <div><dt className="text-xs text-gray-400">{t("bookings.device")}</dt><dd className="font-medium">{selected.brand?.name} {selected.deviceModel?.name}{selected.deviceVariant?.name ? ` (${selected.deviceVariant.name})` : ""}</dd></div>
                      <div><dt className="text-xs text-gray-400">{t("bookings.category")}</dt><dd>{selected.deviceCategory?.name}</dd></div>
                      <div><dt className="text-xs text-gray-400">{t("bookings.repair")}</dt><dd>{selected.repairService?.name}</dd></div>
                      <div><dt className="text-xs text-gray-400">{t("bookings.price")}</dt><dd className="font-semibold">€{selected.price}</dd></div>
                    </>
                  )}
                  {selected.isManualQuote && <div><dt className="text-xs text-gray-400">{t("bookings.price")}</dt><dd className="font-semibold text-amber-600">{t("bookings.quotePending")}</dd></div>}
                  <div><dt className="text-xs text-gray-400">{t("bookings.paymentStatus")}</dt><dd className="capitalize">{selected.paymentStatus || "not_required"}</dd></div>
                </dl>
              </section>

              <section className="rounded-xl border border-gray-100 p-4">
                <h4 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-ink-900"><Calendar size={16} className="text-primary-600" /> {t("bookings.appointment")}</h4>
                <dl className="grid gap-2 text-sm sm:grid-cols-3">
                  <div><dt className="text-xs text-gray-400">{t("bookings.method")}</dt><dd>{selected.serviceMethod}</dd></div>
                  <div><dt className="text-xs text-gray-400">{t("bookings.date")}</dt><dd>{selected.preferredDate ? new Date(selected.preferredDate).toLocaleDateString() : "-"}</dd></div>
                  <div><dt className="text-xs text-gray-400">{t("bookings.time")}</dt><dd className="flex items-center gap-1"><Clock size={13} className="text-gray-400" />{selected.preferredTime || "-"}</dd></div>
                </dl>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsAdmin;
