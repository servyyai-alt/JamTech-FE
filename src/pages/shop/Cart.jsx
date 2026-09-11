import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, Tag, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as orderService from "../../services/orderService.js";
import EmptyState from "../../components/common/EmptyState.jsx";

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal, coupon, setCoupon } = useCart();
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
      showToast(`Coupon applied: -${formatPrice(res.data.discount)}`, "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid coupon", "error");
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-px section-y mx-auto max-w-3xl">
        <EmptyState
          title="Your cart is empty"
          description="Browse the shop to find something you'll love."
          icon={ShoppingBag}
          action={<Link to="/shop" className="btn-primary mt-4">Go to Shop</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={`${item.productId}_${item.variantId || "base"}`} className="card flex gap-4 p-4">
              <img src={item.image} alt={item.title} className="h-20 w-20 rounded-xl object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="font-display font-semibold">{item.title}</p>
                {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                <p className="mt-1 font-semibold text-primary-600">{formatPrice(item.price)}</p>
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
          <h3 className="mb-4 font-display font-semibold">Order Summary</h3>
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="input pl-8 !py-2 text-sm" />
            </div>
            <button onClick={applyCoupon} disabled={applying} className="btn-secondary !px-4 !py-2 text-sm">{applying ? "..." : "Apply"}</button>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {coupon && <div className="flex justify-between text-emerald-600"><dt>Coupon ({coupon.code})</dt><dd>-{formatPrice(coupon.discount)}</dd></div>}
            <div className="flex justify-between text-gray-500"><dt>Shipping & tax</dt><dd>Calculated at checkout</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
            <span className="font-display font-semibold">Estimated Total</span>
            <span className="font-display text-xl font-bold text-primary-600">{formatPrice(subtotal - (coupon?.discount || 0))}</span>
          </div>
          <button onClick={() => navigate("/checkout")} className="btn-primary mt-5 w-full">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};
export default Cart;
