import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";

const STATUS_COLOR = {
  paid: "text-emerald-600", authorised: "text-emerald-600", pending: "text-amber-600",
  failed: "text-red-600", refused: "text-red-600", refunded: "text-blue-600", created: "text-gray-500",
};

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/payments").then((res) => setPayments(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">Payments</h1>
      {payments.length === 0 ? <EmptyState title="No payments yet" /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Merchant Ref</th>
                <th className="px-4 py-3 font-semibold">PSP Ref</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{p.merchantReference}</td>
                  <td className="px-4 py-3 font-mono text-xs">{p.pspReference || "—"}</td>
                  <td className="px-4 py-3 capitalize">{p.referenceType}</td>
                  <td className="px-4 py-3">{formatPrice(p.amount, p.currency)}</td>
                  <td className={`px-4 py-3 font-medium capitalize ${STATUS_COLOR[p.status] || ""}`}>{p.status}</td>
                  <td className="px-4 py-3">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default PaymentsAdmin;
