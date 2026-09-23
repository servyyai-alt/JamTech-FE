import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as orderService from "../../services/orderService.js";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import * as paymentService from "../../services/paymentService.js";

const Checkout = () => {
  const { t } = useTranslation("cart");
  const { items, subtotal, coupon, clearCart } = useCart();
  const cartCurrency = items[0]?.currency || "EUR";
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingSelId, setBillingSelId] = useState(null);
  const [shipSelId, setShipSelId] = useState(null);
  const savedAddresses = user?.addresses || [];
  const prefilled = useRef(false);

  const applyAddress = (a, target) => {
    const p = target === "shipping" ? "ship" : "";
    setValue(`${p}fullName`, a.fullName);
    setValue(`${p}phone`, a.phone);
    setValue(`${p}addressLine1`, a.addressLine1);
    setValue(`${p}addressLine2`, a.addressLine2 || "");
    setValue(`${p}city`, a.city);
    setValue(`${p}postalCode`, a.postalCode);
    setValue(`${p}country`, a.country);
    if (target === "shipping") setShipSelId(a._id);
    else setBillingSelId(a._id);
  };

  useEffect(() => {
    if (prefilled.current || !user) return;
    prefilled.current = true;
    const d = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
    if (d) {
      applyAddress(d, "billing");
      applyAddress(d, "shipping");
    }
  }, [user]);

  if (items.length === 0 && !order) {
    navigate("/cart");
    return null;
  }

  const onSubmit = async (data) => {
    setPlacing(true);
    try {
      const billingAddress = {
        fullName: data.fullName, phone: data.phone, addressLine1: data.addressLine1,
        addressLine2: data.addressLine2, city: data.city, postalCode: data.postalCode, country: data.country,
      };
      const shippingAddress = sameAsBilling ? billingAddress : {
        fullName: data.shipFullName, phone: data.shipPhone, addressLine1: data.shipAddressLine1,
        addressLine2: data.shipAddressLine2, city: data.shipCity, postalCode: data.shipPostalCode, country: data.shipCountry,
      };

      const payload = {
        items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
        billingAddress, shippingAddress, shippingMethod: "Standard",
        couponCode: coupon?.code, guestEmail: user ? undefined : data.email,
        currency: cartCurrency,
      };

      const res = await orderService.createOrder(payload);
      setOrder(res.data);
      
      const paymentRes = await paymentService.createPaymentSession("order", res.data._id);
      if (paymentRes.success && paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      } else {
        throw new Error("Payment session creation failed");
      }
    } catch (err) {
      showToast(err.response?.data?.message || err.message || t("checkout.orderFailed"), "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">{t("checkout.checkout")}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:col-span-2">
          {!user && (
            <div className="card p-6">
              <h3 className="mb-4 font-display font-semibold">{t("checkout.contactDetails")}</h3>
              <label className="label">{t("checkout.email")}</label>
              <input type="email" className="input" {...register("email", { required: !user })} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{t("checkout.emailRequired")}</p>}
            </div>
          )}

          <div className="card p-6">
            <h3 className="mb-4 font-display font-semibold">{t("checkout.billingAddress")}</h3>
            {savedAddresses.length > 0 && (
              <SavedAddressPicker addresses={savedAddresses} selectedId={billingSelId} onSelect={(a) => applyAddress(a, "billing")} t={t} />
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">{t("checkout.fullName")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, "")} {...register("fullName", { required: true })} /></div>
              <div><label className="label">{t("checkout.phone")}</label><input className="input" maxLength={10} minLength={10} onInput={(e) => e.target.value = e.target.value.replace(/[^\d\+\-\s\(\)]/g, "")} {...register("phone", { required: true, maxLength: 10, minLength: 10 })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("checkout.addressLine1")}</label><input className="input" {...register("addressLine1", { required: true })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("checkout.addressLine2")}</label><input className="input" {...register("addressLine2")} /></div>
              <div><label className="label">{t("checkout.city")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s\-]/gu, "")} {...register("city", { required: true })} /></div>
              <div><label className="label">{t("checkout.postalCode")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")} {...register("postalCode", { required: true })} /></div>
              <div><label className="label">{t("checkout.country")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, "")} {...register("country", { required: true })} /></div>
            </div>
          </div>

          <div className="card p-6">
            <label className="mb-4 flex items-center gap-2 font-display font-semibold">
              <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} />
              {t("checkout.shippingSameAsBilling")}
            </label>
            {!sameAsBilling && (
              <>
                {savedAddresses.length > 0 && (
                  <SavedAddressPicker addresses={savedAddresses} selectedId={shipSelId} onSelect={(a) => applyAddress(a, "shipping")} t={t} />
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">{t("checkout.fullName")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, "")} {...register("shipFullName", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.phone")}</label><input className="input" maxLength={10} minLength={10} onInput={(e) => e.target.value = e.target.value.replace(/[^\d\+\-\s\(\)]/g, "")} {...register("shipPhone", { required: !sameAsBilling, maxLength: 10, minLength: 10 })} /></div>
                <div className="sm:col-span-2"><label className="label">{t("checkout.addressLine1")}</label><input className="input" {...register("shipAddressLine1", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.city")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s\-]/gu, "")} {...register("shipCity", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.postalCode")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")} {...register("shipPostalCode", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.country")}</label><input className="input" onInput={(e) => e.target.value = e.target.value.replace(/[^\p{L}\s]/gu, "")} {...register("shipCountry", { required: !sameAsBilling })} /></div>
              </div>
              </>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" required /> {t("checkout.agreeToTerms")} <a href="/terms" className="text-primary-600 underline">{t("checkout.termsAndConditions")}</a>
          </label>

          <button type="submit" disabled={placing} className="btn-primary w-full disabled:opacity-60">
            {placing ? t("checkout.placingOrder") : t("checkout.placeOrder")}
          </button>
        </form>

        <div className="card h-fit p-6">
          <h3 className="mb-4 font-display font-semibold">{t("summary.title")}</h3>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {items.map((i) => (
              <div key={`${i.productId}_${i.variantId || "base"}`} className="flex justify-between text-sm">
                <span className="text-gray-600">{i.title} × {i.quantity}</span>
                <span className="font-medium">{formatPrice(i.price * i.quantity, i.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="font-display font-semibold">{t("summary.subtotal")}</span>
            <span className="font-display font-bold">{formatPrice(subtotal - (coupon?.discount || 0), cartCurrency)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">{t("checkout.finalTotalNote")}</p>
        </div>
      </div>
    </div>
  );
};

const SavedAddressPicker = ({ addresses, selectedId, onSelect, t }) => (
  <div className="mb-4">
    <p className="mb-2 text-xs font-semibold uppercase text-primary-600">{t("checkout.savedAddresses")}</p>
    <div className="grid gap-2 sm:grid-cols-2">
      {addresses.map((a) => (
        <button
          type="button"
          key={a._id}
          onClick={() => onSelect(a)}
          className={`rounded-xl border p-3 text-left text-sm transition ${selectedId === a._id ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600" : "border-gray-200 hover:border-primary-300"}`}
        >
          <p className="font-medium">{a.label}{a.isDefault ? ` · ${t("checkout.default")}` : ""}</p>
          <p className="mt-1 text-gray-500">{a.fullName}</p>
          <p className="text-gray-500">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ""}</p>
          <p className="text-gray-500">{a.city}, {a.postalCode} · {a.country}</p>
          <p className="text-gray-400">{a.phone}</p>
        </button>
      ))}
      <p className="text-xs text-gray-400">{t("checkout.pickSaved")}</p>
    </div>
  </div>
);

export default Checkout;
