import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Minus, Plus, Heart, Star, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as productService from "../../services/productService.js";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as authService from "../../services/authService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StarRating from "../../components/common/StarRating.jsx";
import PriceTag, { formatPrice } from "../../components/common/PriceTag.jsx";
import ProductCard from "../../components/ecommerce/ProductCard.jsx";

const ProductDetails = () => {
  const { t } = useTranslation("shop");
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotal, setReviewTotal] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userTitle, setUserTitle] = useState("");
  const [userComment, setUserComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { addItem, items, subtotal } = useCart();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError(null);
    productService.getProductBySlug(slug)
      .then((res) => {
        setData(res.data);
        if (res.data.variants?.length) setSelectedVariant(res.data.variants[0]);
        setActiveImage(0);
      })
      .catch(() => setError(t("product.notFound")))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (data?.product?._id) {
      let cancelled = false;
      setLoadingReviews(true);
      productService.getProductReviews(data.product._id, 1)
        .then((res) => {
          if (cancelled) return;
          setReviews(res.data || []);
          setReviewPage(1);
          setReviewTotal(res.total || 0);
        })
        .finally(() => { if (!cancelled) setLoadingReviews(false); });
      return () => { cancelled = true; };
    }
  }, [data]);

  if (loading) return <Loader full />;
  if (error) return <div className="container-px section-y mx-auto max-w-3xl"><ErrorState message={error} /></div>;

  const { product, variants, related } = data;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const activePrice = selectedVariant
    ? (selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price ? selectedVariant.discountPrice : selectedVariant.price)
    : (product.salePrice && product.salePrice < product.regularPrice ? product.salePrice : product.regularPrice);
  const images = selectedVariant?.images?.length ? selectedVariant.images : product.images;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      variantId: selectedVariant?._id,
      title: product.title,
      variantLabel: selectedVariant?.label,
      image: images?.[0],
      price: activePrice,
      currency: product.currency,
      quantity,
    });
    setCartDrawerOpen(true);
  };

  const handleWishlist = async () => {
    if (!user) return showToast(t("wishlist.loginRequired"), "info");
    await authService.toggleWishlist(product._id);
    await refreshUser();
    showToast(t("wishlist.updated"), "success");
  };

  const refreshReviews = async () => {
    const res = await productService.getProductReviews(product._id, 1);
    setReviews(res.data || []);
    setReviewPage(1);
    setReviewTotal(res.total || 0);
  };

  const loadMoreReviews = async () => {
    const next = reviewPage + 1;
    setLoadingReviews(true);
    try {
      const res = await productService.getProductReviews(product._id, next);
      setReviews((prev) => [...prev, ...(res.data || [])]);
      setReviewPage(next);
      setReviewTotal(res.total || 0);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userRating) return showToast(t("product.ratingRequired"), "info");
    setSubmitting(true);
    try {
      await productService.createReview(product._id, { rating: userRating, title: userTitle, comment: userComment });
      setUserRating(0); setUserTitle(""); setUserComment("");
      await refreshReviews();
      showToast(t("product.submitted"), "success");
    } catch (err) {
      showToast(err.response?.data?.message || t("product.failed"), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await productService.deleteReview(id);
      await refreshReviews();
      showToast(t("product.deleted"), "success");
    } catch {
      showToast(t("product.failed"), "error");
    }
  };

  const myReview = user ? reviews.find((r) => r.user?._id === user._id) : null;

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-50">
            <img src={images?.[activeImage] || "https://via.placeholder.com/600"} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-2">
            {images?.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImage === i ? "border-primary-500" : "border-transparent"}`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {product.brand && <span className="text-sm font-medium uppercase tracking-wide text-gray-400">{product.brand}</span>}
          <h1 className="mt-1 font-display text-2xl font-bold text-ink-900 md:text-3xl">{product.title}</h1>
          <div className="mt-2"><StarRating rating={product.rating} count={product.numReviews} /></div>

          <div className="mt-5"><PriceTag regularPrice={selectedVariant?.price || product.regularPrice} salePrice={selectedVariant?.discountPrice || product.salePrice} currency={product.currency} size="lg" /></div>
          <p className={`mt-1 text-sm font-medium ${activeStock > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {activeStock > 0 ? t("product.inStock", { count: activeStock }) : t("product.outOfStock")}
          </p>

          {variants?.length > 0 && (
            <div className="mt-5">
              <p className="label">{t("product.selectOption")}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button key={v._id} onClick={() => setSelectedVariant(v)} className={`rounded-lg border-2 px-3 py-2 text-sm ${selectedVariant?._id === v._id ? "border-primary-500 bg-primary-50" : "border-gray-200"}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-gray-200">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3"><Minus size={14} /></button>
              <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))} className="p-3"><Plus size={14} /></button>
            </div>
            <button onClick={handleAddToCart} disabled={activeStock <= 0} className="btn-primary flex-1 disabled:opacity-50">{t("product.addToCart")}</button>
            <button onClick={handleWishlist} className="rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50">
              <Heart size={18} className={user?.wishlist?.includes(product._id) ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
            <div className="flex flex-col items-center gap-1"><Truck size={18} className="text-primary-600" />{product.deliveryEstimate || t("product.deliveryEstimate")}</div>
            <div className="flex flex-col items-center gap-1"><ShieldCheck size={18} className="text-primary-600" />{product.warranty || t("product.warranty")}</div>
            <div className="flex flex-col items-center gap-1"><RotateCcw size={18} className="text-primary-600" />{product.returnsPolicy || t("product.returnsPolicy")}</div>
          </div>

          {product.shortDescription && <p className="mt-6 text-sm text-gray-600">{product.shortDescription}</p>}
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-display text-xl font-bold">{t("product.description")}</h2>
          <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

          {product.specifications?.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-3 font-display text-xl font-bold">{t("product.specifications")}</h2>
              <dl className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                {product.specifications.map((s, i) => (
                  <div key={i} className="flex justify-between px-4 py-2.5 text-sm odd:bg-gray-50">
                    <dt className="text-gray-500">{s.key}</dt><dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 font-display text-xl font-bold">{t("product.reviews", { count: reviews.length })}</h2>

          {myReview ? (
            <div className="mb-5 rounded-xl border border-gold-500/40 bg-gold-50 p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-semibold">{t("product.yourReview")}</p>
                <button onClick={() => handleDeleteReview(myReview._id)} className="flex items-center gap-1 text-xs font-medium text-red-500 hover:underline"><Trash2 size={13} />{t("product.deleteReview")}</button>
              </div>
              <StarRating rating={myReview.rating} size={13} showValue={false} />
              {myReview.title && <p className="mt-1 text-sm font-medium">{myReview.title}</p>}
              <p className="mt-1 text-sm text-gray-600">{myReview.comment}</p>
            </div>
          ) : user ? (
            <form onSubmit={handleSubmitReview} className="mb-5 space-y-3 rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-semibold">{t("product.writeReview")}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setUserRating(n)} aria-label={`${n} star`}>
                    <Star size={20} className={`transition hover:scale-110 ${n <= userRating ? "fill-gold-500 text-gold-500" : "fill-gray-200 text-gray-200"}`} />
                  </button>
                ))}
              </div>
              <input className="input" placeholder={t("product.titlePlaceholder")} value={userTitle} onChange={(e) => setUserTitle(e.target.value)} />
              <textarea required rows={3} className="input" placeholder={t("product.commentPlaceholder")} value={userComment} onChange={(e) => setUserComment(e.target.value)} />
              <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? t("product.submitting") : t("product.submit")}</button>
            </form>
          ) : (
            <div className="mb-5 rounded-xl border border-gray-200 p-4 text-sm">
              <Link to="/login" className="font-medium text-primary-600 underline">{t("product.loginToReview")}</Link>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">{t("product.noReviews")}</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-gray-100 pb-4">
                  <StarRating rating={r.rating} size={13} showValue={false} />
                  {r.title && <p className="mt-1 text-sm font-semibold">{r.title}</p>}
                  <p className="text-sm text-gray-500">{r.user?.name}</p>
                  <p className="mt-1 text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
              {reviewPage < Math.ceil(reviewTotal / 10) && (
                <button onClick={loadMoreReviews} disabled={loadingReviews} className="btn-o w-full !py-2 text-sm disabled:opacity-60">
                  {loadingReviews ? t("product.loadingMore") : t("product.loadMore", { count: reviews.length, total: reviewTotal })}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {related?.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-xl font-bold">{t("product.relatedProducts")}</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}

      {cartDrawerOpen && (
        <div className={`fixed inset-0 z-[100] transition-opacity`}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartDrawerOpen(false)} />
          <div className={`absolute top-0 bottom-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl animate-fade-left animate-duration-[300ms]`}>
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h2 className="font-display text-lg font-bold text-ink-900 flex items-center gap-2"><ShieldCheck className="text-primary-600" size={20} /> Added to Cart</h2>
              <button onClick={() => setCartDrawerOpen(false)} className="rounded-full bg-gray-50 p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-4 mb-8">
                {items.length > 0 ? items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img src={item.image || ""} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <h3 className="font-semibold text-ink-900 text-sm">{item.title}</h3>
                      {item.variantLabel && <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>}
                      <div className="mt-1 flex items-center justify-between">
                        <p className="font-bold text-primary-600 text-sm">{formatPrice(item.price, item.currency)}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-gray-500 text-sm py-4">Your cart is empty.</p>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-6 border-t border-gray-100 pt-4">
                <span className="font-semibold text-ink-900">Subtotal</span>
                <span className="font-bold text-primary-600 text-lg">{formatPrice(subtotal, items[0]?.currency || "EUR")}</span>
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <Link to="/cart" className="btn-primary w-full text-center">View Cart & Checkout</Link>
                <Link to="/shop" className="btn-secondary w-full text-center">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductDetails;
