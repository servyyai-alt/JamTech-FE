import React from "react";

const STATUS_COLORS = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "Device Received": "bg-indigo-100 text-indigo-700",
  Diagnosis: "bg-purple-100 text-purple-700",
  "Repair In Progress": "bg-amber-100 text-amber-700",
  "Awaiting Parts": "bg-orange-100 text-orange-700",
  "Repair Completed": "bg-emerald-100 text-emerald-700",
  "Ready for Collection": "bg-teal-100 text-teal-700",
  "Out for Delivery": "bg-cyan-100 text-cyan-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  Processing: "bg-amber-100 text-amber-700",
  Shipped: "bg-cyan-100 text-cyan-700",
  Returned: "bg-red-100 text-red-700",
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700"}`}>
    {status}
  </span>
);

export default StatusBadge;
