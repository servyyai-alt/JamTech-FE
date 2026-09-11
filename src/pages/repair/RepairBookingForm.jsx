import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as bookingService from "../../services/bookingService.js";
import RepairStepper from "../../components/service/RepairStepper.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { Home, Truck, Mail, MapPin } from "lucide-react";

const SERVICE_METHODS = [
  { value: "Store Visit", label: "Store Visit", icon: Home, desc: "Bring your device to our store" },
  { value: "Pickup & Delivery", label: "Pickup & Delivery", icon: Truck, desc: "We collect and return your device" },
  { value: "Mail-in Repair", label: "Mail-in Repair", icon: Mail, desc: "Ship your device to us securely" },
  { value: "On-site Repair", label: "On-site Repair", icon: MapPin, desc: "A technician comes to you" },
];

const RepairBookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, brand, model, variant, service, price } = location.state || {};
  const { user } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" },
  });
  const [serviceMethod, setServiceMethod] = useState("Store Visit");
  const [submitting, setSubmitting] = useState(false);

  if (!category || !brand || !model || !service || !price) {
    return (
      <div className="container-px section-y mx-auto max-w-2xl text-center">
        <p className="text-gray-500">Missing booking details. Please start the repair flow again.</p>
        <button onClick={() => navigate("/repair")} className="btn-primary mt-4">Back to Repair Services</button>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        deviceCategory: category._id,
        brand: brand._id,
        deviceModel: model._id,
        deviceVariant: variant?._id,
        repairService: service._id,
        serviceMethod,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        customerDetails: {
          name: data.name, email: data.email, phone: data.phone,
          address: data.address, city: data.city, postalCode: data.postalCode, country: data.country,
        },
      };
      const res = await bookingService.createBooking(payload);
      navigate(`/repair/booking-success/${res.data.bookingNumber}`, { state: { booking: res.data } });
    } catch (err) {
      showToast(err.response?.data?.message || "Booking failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const needsAddress = serviceMethod === "Pickup & Delivery" || serviceMethod === "On-site Repair" || serviceMethod === "Mail-in Repair";

  return (
    <div className="container-px section-y mx-auto max-w-5xl">
      <RepairStepper current={5} />
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h3 className="mb-4 font-display font-semibold">Service Method</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICE_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => setServiceMethod(m.value)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${serviceMethod === m.value ? "border-primary-500 bg-primary-50" : "border-gray-100 hover:border-gray-200"}`}
                >
                  <m.icon size={20} className="mt-0.5 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 font-display font-semibold">Preferred Date & Time</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Date *</label>
                <input type="date" min={new Date().toISOString().split("T")[0]} className="input" {...register("preferredDate", { required: true })} />
                {errors.preferredDate && <p className="mt-1 text-xs text-red-500">Date is required</p>}
              </div>
              <div>
                <label className="label">Time *</label>
                <input type="time" className="input" {...register("preferredTime", { required: true })} />
                {errors.preferredTime && <p className="mt-1 text-xs text-red-500">Time is required</p>}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 font-display font-semibold">Your Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Full Name *</label><input className="input" {...register("name", { required: true })} />{errors.name && <p className="mt-1 text-xs text-red-500">Name is required</p>}</div>
              <div><label className="label">Email *</label><input type="email" className="input" {...register("email", { required: true })} />{errors.email && <p className="mt-1 text-xs text-red-500">Email is required</p>}</div>
              <div><label className="label">Phone *</label><input className="input" {...register("phone", { required: true })} />{errors.phone && <p className="mt-1 text-xs text-red-500">Phone is required</p>}</div>
              {needsAddress && (
                <>
                  <div className="sm:col-span-2"><label className="label">Address *</label><input className="input" {...register("address", { required: needsAddress })} /></div>
                  <div><label className="label">City *</label><input className="input" {...register("city", { required: needsAddress })} /></div>
                  <div><label className="label">Postal Code *</label><input className="input" {...register("postalCode", { required: needsAddress })} /></div>
                  <div><label className="label">Country *</label><input className="input" {...register("country", { required: needsAddress })} /></div>
                </>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Confirming Booking..." : "Confirm Booking"}
          </button>
        </form>

        <div className="card sticky top-24 h-fit p-6">
          <h3 className="mb-4 font-display font-semibold">Booking Summary</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Device</dt><dd className="font-medium">{brand.name} {model.name}</dd></div>
            {variant && <div className="flex justify-between"><dt className="text-gray-500">Config</dt><dd className="font-medium">{variant.label}</dd></div>}
            <div className="flex justify-between"><dt className="text-gray-500">Repair</dt><dd className="font-medium">{service.name}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Method</dt><dd className="font-medium">{serviceMethod}</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="font-display font-semibold">Total</span>
            <span className="font-display text-xl font-bold text-primary-600">{formatPrice(price.finalPrice ?? price.regularPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RepairBookingForm;
