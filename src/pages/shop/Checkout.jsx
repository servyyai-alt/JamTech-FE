import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as orderService from "../../services/orderService.js";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import AdyenDropIn from "../../components/payment/AdyenDropIn.jsx";

const Checkout = () => {
  const { t } = useTranslation("cart");
  const { items, subtotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [order, setOrder] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);

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
      };

      const res = await orderService.createOrder(payload);
      setOrder(res.data);
    } catch (err) {
      showToast(err.response?.data?.message || t("checkout.orderFailed"), "error");
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentResult = (result) => {
    clearCart();
    const success = result.resultCode === "Authorised" || result.resultCode === "Received";
    navigate(success ? "/payment-success" : "/payment-failed", { state: { orderNumber: order.orderNumber } });
  };

  if (order) {
    return (
      <div className="container-px section-y mx-auto max-w-xl">
        <h1 className="mb-2 text-center font-display text-2xl font-bold">{t("checkout.completePayment")}</h1>
        <p className="mb-6 text-center text-sm text-gray-500">{t("checkout.orderLine", { orderNumber: order.orderNumber, amount: formatPrice(order.totalAmount) })}</p>
        <div className="card p-6">
          <AdyenDropIn referenceType="order" referenceId={order._id} onPaymentResult={handlePaymentResult} />
        </div>
      </div>
    );
  }

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
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">{t("checkout.fullName")}</label><input className="input" {...register("fullName", { required: true })} /></div>
              <div><label className="label">{t("checkout.phone")}</label><input className="input" {...register("phone", { required: true })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("checkout.addressLine1")}</label><input className="input" {...register("addressLine1", { required: true })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("checkout.addressLine2")}</label><input className="input" {...register("addressLine2")} /></div>
              <div><label className="label">{t("checkout.city")}</label><input className="input" {...register("city", { required: true })} /></div>
              <div><label className="label">{t("checkout.postalCode")}</label><input className="input" {...register("postalCode", { required: true })} /></div>
              <div><label className="label">{t("checkout.country")}</label><input className="input" {...register("country", { required: true })} /></div>
            </div>
          </div>

          <div className="card p-6">
            <label className="mb-4 flex items-center gap-2 font-display font-semibold">
              <input type="checkbox" checked={sameAsBilling} onChange={(e) => setSameAsBilling(e.target.checked)} />
              {t("checkout.shippingSameAsBilling")}
            </label>
            {!sameAsBilling && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="label">{t("checkout.fullName")}</label><input className="input" {...register("shipFullName", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.phone")}</label><input className="input" {...register("shipPhone", { required: !sameAsBilling })} /></div>
                <div className="sm:col-span-2"><label className="label">{t("checkout.addressLine1")}</label><input className="input" {...register("shipAddressLine1", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.city")}</label><input className="input" {...register("shipCity", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.postalCode")}</label><input className="input" {...register("shipPostalCode", { required: !sameAsBilling })} /></div>
                <div><label className="label">{t("checkout.country")}</label><input className="input" {...register("shipCountry", { required: !sameAsBilling })} /></div>
              </div>
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
                <span className="font-medium">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="font-display font-semibold">{t("summary.subtotal")}</span>
            <span className="font-display font-bold">{formatPrice(subtotal - (coupon?.discount || 0))}</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">{t("checkout.finalTotalNote")}</p>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
