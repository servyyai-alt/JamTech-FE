import api from "./api.js";

export const createPaymentSession = (referenceType, referenceId) =>
  api.post("/payments/session", { referenceType, referenceId }).then((r) => r.data);
export const getPaymentStatus = (merchantReference) =>
  api.get(`/payments/status/${merchantReference}`).then((r) => r.data);
