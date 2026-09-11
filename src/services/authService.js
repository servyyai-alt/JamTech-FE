import api from "./api.js";

export const register = (data) => api.post("/auth/register", data).then((r) => r.data);
export const login = (data) => api.post("/auth/login", data).then((r) => r.data);
export const logout = () => api.post("/auth/logout").then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const updateMe = (data) => api.patch("/auth/update-me", data).then((r) => r.data);
export const changePassword = (data) => api.patch("/auth/change-password", data).then((r) => r.data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data);
export const resetPassword = (token, password) => api.patch(`/auth/reset-password/${token}`, { password }).then((r) => r.data);
export const addAddress = (data) => api.post("/auth/addresses", data).then((r) => r.data);
export const updateAddress = (id, data) => api.patch(`/auth/addresses/${id}`, data).then((r) => r.data);
export const deleteAddress = (id) => api.delete(`/auth/addresses/${id}`).then((r) => r.data);
export const toggleWishlist = (productId) => api.post(`/auth/wishlist/${productId}`).then((r) => r.data);
