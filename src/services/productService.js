import api from "./api.js";

export const getProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`).then((r) => r.data);
export const searchProducts = (q) => api.get("/products/search", { params: { q } }).then((r) => r.data);
export const getCategories = () => api.get("/categories").then((r) => r.data);
export const getProductReviews = (productId, page = 1, params = {}) => api.get(`/reviews/product/${productId}`, { params: { page, limit: 10, ...params } }).then((r) => r.data);
export const getProductReviewSummary = (productId) => api.get(`/reviews/product/${productId}/summary`).then((r) => r.data);
export const getMyProductReview = (productId) => api.get(`/reviews/product/${productId}/my-review`).then((r) => r.data);
export const createReview = (productId, data) => api.post(`/reviews/product/${productId}`, data).then((r) => r.data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);
