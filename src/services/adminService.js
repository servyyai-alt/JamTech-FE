import api from "./api.js";

export const getDashboardStats = () => api.get("/admin/dashboard-stats").then((r) => r.data);
export const getMonthlySales = (year) => api.get("/admin/monthly-sales", { params: { year } }).then((r) => r.data);
export const getPopularBrands = () => api.get("/admin/popular-brands").then((r) => r.data);
export const getPopularRepairs = () => api.get("/admin/popular-repairs").then((r) => r.data);

export const getAllBookings = (params) => api.get("/bookings", { params }).then((r) => r.data);
export const updateBookingStatus = (id, status, note) => api.patch(`/bookings/${id}/status`, { status, note }).then((r) => r.data);

export const getAllOrders = (params) => api.get("/orders", { params }).then((r) => r.data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status }).then((r) => r.data);

export const getAllUsers = (params) => api.get("/users", { params }).then((r) => r.data);
export const updateUserStatus = (id, isActive) => api.patch(`/users/${id}/status`, { isActive }).then((r) => r.data);

export const crud = {
  list: (resource, params) => api.get(`/${resource}`, { params }).then((r) => r.data),
  create: (resource, data) => api.post(`/${resource}`, data).then((r) => r.data),
  update: (resource, id, data) => api.patch(`/${resource}/${id}`, data).then((r) => r.data),
  remove: (resource, id) => api.delete(`/${resource}/${id}`).then((r) => r.data),
};
