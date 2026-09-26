export const REPAIR_FLOW = [
  "Pending",
  "Confirmed",
  "Device Received",
  "Diagnosis",
  "Repair In Progress",
  "Awaiting Parts",
  "Repair Completed",
  "Ready for Collection",
  "Out for Delivery",
  "Delivered",
];

export const REPAIR_FLOW_ENDED = ["Cancelled"];

export const getRepairStep = (status) => {
  const total = REPAIR_FLOW.length;
  const index = REPAIR_FLOW.indexOf(status);
  if (index === -1) return { index: 0, total, ended: REPAIR_FLOW_ENDED.includes(status), complete: false };
  return { index, total, ended: false, complete: index === total - 1 };
};
