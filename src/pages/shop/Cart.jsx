import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as orderService from "../../services/orderService.js";
import EmptyState from "../../components/common/EmptyState.jsx";

const Cart = () => {
  const { t } = useTranslation("cart");
  const { items, updateQuantity, removeItem, subtotal, coupon, setCoupon } = useCart();
  const cartCurrency = items[0]?.currency || "EUR";
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const res = await orderService.validateCoupon(couponCode.trim(), subtotal);
      setCoupon(res.data);
      showToast(t("coupon.applied", { discount: formatPrice(res.data.discount, res.data.currency || cartCurrency) }), "success");
    } catch (err) {
      showToast(err.response?.data?.message || t("coupon.invalid"), "error");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-px section-y mx-auto max-w-3xl">
        <EmptyState
          title={t("cart.empty.title")}
          description={t("cart.empty.description")}
          icon={ShoppingBag}
          action={<Link to="/shop" className="btn-primary mt-4">{t("cart.empty.goToShop")}</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">{t("cart.title")}</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={`${item.productId}_${item.variantId || "base"}`} className="card flex gap-4 p-4">
              <img src={item.image} alt={item.title} className="h-20 w-20 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="font-display font-semibold">{item.title}</p>
                {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                <p className="mt-1 font-semibold text-primary-600">{formatPrice(item.price, item.currency)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeItem(item.productId, item.variantId)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                <div className="flex items-center rounded-lg border border-gray-200">
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-2"><Minus size={13} /></button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-2"><Plus size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h3 className="mb-4 font-display font-semibold">{t("summary.title")}</h3>
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder={t("coupon.placeholder")} className="input !py-2 text-sm" />
            </div>
            <button onClick={applyCoupon} disabled={applying} className="btn-secondary !px-4 !py-2 text-sm">{applying ? "..." : t("coupon.apply")}</button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">{t("summary.subtotal")}</dt><dd>{formatPrice(subtotal, cartCurrency)}</dd></div>
            {coupon && <div className="flex justify-between text-emerald-600"><dt>{t("summary.coupon", { code: coupon.code })}</dt><dd>-{formatPrice(coupon.discount, coupon.currency || cartCurrency)}</dd></div>}
            <div className="flex justify-between text-gray-500"><dt>{t("summary.shippingTax")}</dt><dd>{formatPrice(0, cartCurrency)}</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="font-display font-semibold">{t("summary.estimatedTotal")}</span>
            <span className="font-display text-xl font-bold text-primary-600">{formatPrice(subtotal - (coupon?.discount || 0), cartCurrency)}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-5 w-full">{t("checkout.proceedToCheckout")}</button>
        </div>
      </div>
    </div>
  );
};
export default Cart;
