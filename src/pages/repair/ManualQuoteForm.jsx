import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Mail, MapPin, Truck, Wrench, Calendar, User, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as bookingService from "../../services/bookingService.js";

const METHODS = [
  { value: "Store Visit", icon: Home },
  { value: "Pickup & Delivery", icon: Truck },
  { value: "Mail-in Repair", icon: Mail },
  { value: "On-site Repair", icon: MapPin },
];

const ManualQuoteForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("repair");
  const { user } = useAuth();
  const { showToast } = useToast();
  const [serviceMethod, setServiceMethod] = useState("Store Visit");
  const [submitting, setSubmitting] = useState(false);
  const needsAddress = serviceMethod === "Pickup & Delivery" || serviceMethod === "On-site Repair" || serviceMethod === "Mail-in Repair";
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      category: state?.category?.name || "",
      brand: state?.brand?.name || "",
      model: state?.model?.name || "",
      variant: state?.variant?.label || "",
      issue: state?.service ? `Requested repair: ${state.service.name}. ` : "",
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await bookingService.createManualQuote({
        customDevice: {
          category: data.category,
          brand: data.brand,
          model: data.model,
          variant: data.variant,
          issue: data.issue,
        },
        serviceMethod,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        customerDetails: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
      });
      navigate(`/repair/booking-success/${response.data.bookingNumber}`, { state: { booking: response.data } });
    } catch (error) {
      showToast(error.response?.data?.message || t("error.quoteSubmitFailed"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const input = (name, labelKey, options = {}) => (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">{t(labelKey)}{options.required !== false && " *"}</label>
      <input 
        className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-sm font-medium text-ink-900 border border-gray-100 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/15" 
        type={options.type || "text"} 
        onInput={options.onInput}
        {...register(name, { required: options.required !== false })} 
      />
      {errors[name] && <p className="mt-1.5 text-xs font-semibold text-red-500">{t("error.fieldRequired", { field: t(labelKey) })}</p>}
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FFFAF5]">
      {/* Subtle ambient glow to make it feel premium and slightly orange without being overwhelming */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-[100px]" />
      <div className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-gold-100/30 blur-[80px]" />

      <div className="container-px section-y mx-auto max-w-3xl relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="mb-10 text-center animate-fade-up">
          <h1 className="font-display text-3xl font-bold text-ink-900 md:text-4xl" style={{ fontFamily: "'Syne', sans-serif" }}>{t("title")}</h1>
          <p className="mt-3 text-gray-500">{t("subtitle")}</p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          <div className="bg-slate-800 px-6 py-5 sm:px-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm"><Wrench size={18} /></div>
            <h2 className="font-display text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{t("deviceAndIssue")}</h2>
          </div>
          <div className="p-6 sm:p-8 grid gap-5 sm:grid-cols-2">
            {input("category", "fieldDeviceCategory", { required: false })}
            {input("brand", "fieldBrand")}
            {input("model", "fieldModel")}
            {input("variant", "fieldVariant", { required: false })}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">{t("whatNeedsRepair")} *</label>
              <textarea rows={4} className="w-full rounded-xl bg-gray-50 px-4 py-3.5 text-sm font-medium text-ink-900 border border-gray-100 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/15" placeholder={t("issuePlaceholder")} {...register("issue", { required: true })} />
              {errors.issue && <p className="mt-1.5 text-xs font-semibold text-red-500">{t("error.describeIssue")}</p>}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <div className="bg-slate-800 px-6 py-5 sm:px-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm"><Calendar size={18} /></div>
            <h2 className="font-display text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{t("appointment")}</h2>
          </div>
          <div className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {METHODS.map(({ value, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setServiceMethod(value)} className={`group relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${serviceMethod === value ? "border-primary-500 bg-primary-50/50 shadow-md" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"}`}>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${serviceMethod === value ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
                    <Icon size={18} />
                  </div>
                  <div className={`font-bold ${serviceMethod === value ? "text-primary-900" : "text-ink-900"}`} style={{ fontFamily: "'Syne', sans-serif" }}>{t(`methods.${value}`, { defaultValue: value })}</div>
                </button>
              ))}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 pt-2 border-t border-gray-100">
              <div className="mt-4">{input("preferredDate", "preferredDate", { type: "date" })}</div>
              <div className="mt-4">{input("preferredTime", "preferredTime", { type: "time" })}</div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-gray-100 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="bg-slate-800 px-6 py-5 sm:px-8 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm"><User size={18} /></div>
            <h2 className="font-display text-lg font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>{t("contactDetails")}</h2>
          </div>
          <div className="p-6 sm:p-8 grid gap-5 sm:grid-cols-2">
            {input("name", "fullName", { onInput: (e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, "") })}
            {input("email", "email", { type: "email", required: false })}
            {input("phone", "phone", { onInput: (e) => e.target.value = e.target.value.replace(/[^\d\+\-\s\(\)]/g, "") })}
            {needsAddress && (
              <>
                <div className="sm:col-span-2">{input("address", "address", { required: needsAddress })}</div>
                {input("city", "city", { required: needsAddress, onInput: (e) => e.target.value = e.target.value.replace(/[^\p{L}\s\-]/gu, "") })}
                {input("postalCode", "postalCode", { required: needsAddress, onInput: (e) => e.target.value = e.target.value.replace(/[^0-9]/g, "") })}
                {input("country", "country", { required: needsAddress, onInput: (e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, "") })}
              </>
            )}
          </div>
        </section>

        <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-gold-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/30 disabled:opacity-60 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "both", fontFamily: "'Syne', sans-serif" }}>
          {submitting ? t("submitting") : t("requestManualQuote")} <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
    </div>
  );
};

export default ManualQuoteForm;
