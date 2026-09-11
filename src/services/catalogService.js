import api from "./api.js";

export const getDeviceCategories = () => api.get("/device-catalog/categories").then((r) => r.data);
export const getBrands = (categoryId) => api.get("/device-catalog/brands", { params: { category: categoryId } }).then((r) => r.data);
export const getModels = (brandId) => api.get("/device-catalog/models", { params: { brand: brandId } }).then((r) => r.data);
export const getVariants = (modelId) => api.get("/device-catalog/variants", { params: { model: modelId } }).then((r) => r.data);
export const getRepairServices = (params) => api.get("/repairs/services", { params }).then((r) => r.data);
export const getRepairPriceLookup = (params) => api.get("/repairs/prices/lookup", { params }).then((r) => r.data);
