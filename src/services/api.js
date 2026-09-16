import axios from "axios";
import i18n from "../i18n.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jam_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const lang = i18n.language?.startsWith("fr") ? "fr" : "en";
  config.params = { ...(config.params || {}), lang };
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("jam_token");
    }
    return Promise.reject(err);
  }
);

export default api;
