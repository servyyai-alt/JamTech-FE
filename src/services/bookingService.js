import api from "./api.js";

export const createBooking = (data) => api.post("/bookings", data).then((r) => r.data);
export const createManualQuote = (data) => api.post("/bookings/manual-quote", data).then((r) => r.data);
export const trackBooking = (bookingNumber) => api.get(`/bookings/track/${bookingNumber}`).then((r) => r.data);
export const getMyBookings = () => api.get("/bookings/my-bookings").then((r) => r.data);
