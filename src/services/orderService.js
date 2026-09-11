import api from "./api.js";

export const createOrder = (data) => api.post("/orders", data).then((r) => r.data);
export const trackOrder = (orderNumber) => api.get(`/orders/track/${orderNumber}`).then((r) => r.data);
export const getMyOrders = () => api.get("/orders/my-orders").then((r) => r.data);
export const getOrder = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const validateCoupon = (code, subtotal) => api.post("/coupons/validate", { code, subtotal }).then((r) => r.data);
