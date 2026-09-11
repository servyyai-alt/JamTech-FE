import api from "./api.js";

export const getProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const getProductBySlug = (slug) => api.get(`/products/slug/${slug}`).then((r) => r.data);
export const searchProducts = (q) => api.get("/products/search", { params: { q } }).then((r) => r.data);
export const getCategories = () => api.get("/categories").then((r) => r.data);
export const getProductReviews = (productId) => api.get(`/reviews/product/${productId}`).then((r) => r.data);
export const createReview = (productId, data) => api.post(`/reviews/product/${productId}`, data).then((r) => r.data);
