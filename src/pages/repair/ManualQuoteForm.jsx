import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Mail, MapPin, Truck } from "lucide-react";
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
      <label className="label">{t(labelKey)}{options.required !== false && " *"}</label>
      <input className="input" type={options.type || "text"} {...register(name, { required: options.required !== false })} />
      {errors[name] && <p className="mt-1 text-xs text-red-500">{t("error.fieldRequired", { field: t(labelKey) })}</p>}
    </div>
  );

  return (
    <div className="container-px section-y mx-auto max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{t("title")}</h1>
        <p className="mt-2 text-gray-500">{t("subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="card p-6">
          <h2 className="mb-4 font-display font-semibold">{t("deviceAndIssue")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {input("category", "fieldDeviceCategory", { required: false })}
            {input("brand", "fieldBrand")}
            {input("model", "fieldModel")}
            {input("variant", "fieldVariant", { required: false })}
            <div className="sm:col-span-2">
              <label className="label">{t("whatNeedsRepair")} *</label>
              <textarea rows={4} className="input" placeholder={t("issuePlaceholder")} {...register("issue", { required: true })} />
              {errors.issue && <p className="mt-1 text-xs text-red-500">{t("error.describeIssue")}</p>}
            </div>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display font-semibold">{t("appointment")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {METHODS.map(({ value, icon: Icon }) => <button key={value} type="button" onClick={() => setServiceMethod(value)} className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left text-sm font-medium ${serviceMethod === value ? "border-primary-500 bg-primary-50" : "border-gray-100"}`}><Icon size={18} className="text-primary-600" />{t(`methods.${value}`, { defaultValue: value })}</button>)}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {input("preferredDate", "preferredDate", { type: "date" })}
            {input("preferredTime", "preferredTime", { type: "time" })}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="mb-4 font-display font-semibold">{t("contactDetails")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {input("name", "fullName")}
            {input("email", "email", { type: "email", required: false })}
            {input("phone", "phone")}
            {needsAddress && (
              <>
                <div className="sm:col-span-2">{input("address", "address", { required: needsAddress })}</div>
                {input("city", "city", { required: needsAddress })}
                {input("postalCode", "postalCode", { required: needsAddress })}
                {input("country", "country", { required: needsAddress })}
              </>
            )}
          </div>
        </section>

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? t("submitting") : t("requestManualQuote")}</button>
      </form>
    </div>
  );
};

export default ManualQuoteForm;
