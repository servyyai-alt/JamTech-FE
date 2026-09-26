import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Minus, Plus, Heart, Star, Trash2, X, ArrowRight } from "lucide-react";
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
  const [reviewSort, setReviewSort] = useState("recent");
  const [reviewFilter, setReviewFilter] = useState(0);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
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

  // the star breakdown and the signed-in user's own review belong to the product,
  // not to a page of the list, so they load once and survive paging
  // the service layer returns the whole response body, so unwrap `.data` here
  const fetchReviewMeta = async (id) => {
    const [summaryRes, mineRes] = await Promise.allSettled([
      productService.getProductReviewSummary(id),
      user ? productService.getMyProductReview(id) : Promise.resolve(null),
    ]);
    return {
      summary: summaryRes.status === "fulfilled" ? summaryRes.value?.data || null : null,
      mine: mineRes.status === "fulfilled" ? mineRes.value?.data || null : null,
    };
  };

  useEffect(() => {
    if (!data?.product?._id) return undefined;
    let cancelled = false;
    fetchReviewMeta(data.product._id).then((meta) => {
      if (cancelled) return;
      setReviewSummary(meta.summary);
      setMyReview(meta.mine);
    });
    return () => { cancelled = true; };
  }, [data?.product?._id, user?._id]);

  useEffect(() => {
    if (!data?.product?._id) return undefined;
    let cancelled = false;
    setLoadingReviews(true);
    productService.getProductReviews(data.product._id, 1, { sort: reviewSort, rating: reviewFilter || undefined })
      .then((res) => {
        if (cancelled) return;
        setReviews(res.data || []);
        setReviewPage(1);
        setReviewTotal(res.total || 0);
      })
      .finally(() => { if (!cancelled) setLoadingReviews(false); });
    return () => { cancelled = true; };
  }, [data?.product?._id, reviewSort, reviewFilter, reviewRefreshKey]);

  if (loading) return <Loader full />;
  if (error) return <div className="container-px section-y mx-auto max-w-3xl"><ErrorState message={error} /></div>;

  const { product, variants, related } = data;
  const relatedProducts = related?.slice(0, 4) || [];
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
    const id = data?.product?._id;
    if (!id) return;
    const meta = await fetchReviewMeta(id);
    setReviewSummary(meta.summary);
    setMyReview(meta.mine);
    setReviewRefreshKey((k) => k + 1);
  };

  const loadMoreReviews = async () => {
    const next = reviewPage + 1;
    setLoadingReviews(true);
    try {
      const res = await productService.getProductReviews(product._id, next, { sort: reviewSort, rating: reviewFilter || undefined });
      // a review posted mid-scroll shifts every offset, so guard against repeats
      setReviews((prev) => {
        const seen = new Set(prev.map((r) => r._id));
        return [...prev, ...(res.data || []).filter((r) => !seen.has(r._id))];
      });
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

  const summaryTotal = reviewSummary?.total ?? product.numReviews ?? 0;
  const summaryAverage = reviewSummary?.average ?? product.rating ?? 0;
  const distribution = reviewSummary?.distribution || {};
  const ratingRows = [5, 4, 3, 2, 1];
  const visibleTotal = reviews.length;

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
          <div className="mt-2"><StarRating rating={summaryAverage} count={summaryTotal} /></div>

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

        <div className="min-w-0">
          <h2 className="mb-3 font-display text-xl font-bold">{t("product.reviews", { count: summaryTotal })}</h2>

          {summaryTotal > 0 && (
            <div className="mb-5 rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50/60 via-white to-gold-50/50 p-4 sm:p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-gray-500">{t("product.ratingBreakdown")}</p>
              <ul className="min-w-0 space-y-1.5">
                {ratingRows.map((star) => {
                  const count = distribution[star] || 0;
                  const pct = summaryTotal > 0 ? (count / summaryTotal) * 100 : 0;
                  const active = reviewFilter === star;
                  return (
                    <li key={star}>
                      <button
                        type="button"
                        onClick={() => setReviewFilter(active ? 0 : star)}
                        aria-pressed={active}
                        aria-label={t("product.showOnlyStars", { count: star })}
                        className={`group flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition hover:bg-white/70 ${active ? "bg-white shadow-sm ring-1 ring-primary-200" : ""}`}
                      >
                        <span className="flex w-9 shrink-0 items-center gap-0.5 text-xs font-semibold text-gray-600">
                          {star}
                          <Star size={11} className="fill-gold-500 text-gold-500" />
                        </span>
                        <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-gray-200/80">
                          <span
                            className="block h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="w-9 shrink-0 text-right text-xs tabular-nums text-gray-500">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-500">
              {t("product.sortBy")}
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-ink-900 outline-none transition focus:border-primary-400"
              >
                <option value="recent">{t("product.sortRecent")}</option>
                <option value="highest">{t("product.sortHighest")}</option>
                <option value="lowest">{t("product.sortLowest")}</option>
              </select>
            </label>
            {reviewFilter > 0 && (
              <button
                type="button"
                onClick={() => setReviewFilter(0)}
                className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 transition hover:bg-primary-100"
              >
                {reviewFilter}
                <Star size={11} className="fill-current" />
                <X size={12} />
              </button>
            )}
          </div>

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

          {loadingReviews && reviews.length === 0 ? (
            <div className="space-y-3" aria-busy="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-gray-400">{reviewFilter > 0 ? t("product.noReviewsMatch") : t("product.noReviews")}</p>
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
              {reviewPage < Math.ceil(reviewTotal / 10) ? (
                <>
                  <p className="text-center text-xs text-gray-400">{t("product.showingOf", { shown: visibleTotal, total: reviewTotal })}</p>
                  <button onClick={loadMoreReviews} disabled={loadingReviews} className="btn-o w-full !py-2 text-sm disabled:opacity-60">
                    {loadingReviews ? t("product.loadingMore") : t("product.loadMore", { count: visibleTotal, total: reviewTotal })}
                  </button>
                </>
              ) : (
                reviewTotal > 10 && <p className="text-center text-xs text-gray-400">{t("product.showingOf", { shown: visibleTotal, total: reviewTotal })}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16 overflow-hidden rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 via-white to-gold-50 p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {product.category?.name && (
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">{product.category.name}</p>
              )}
              <h2 className="font-display text-2xl font-bold text-ink-900">{t("product.relatedProducts")}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">{t("product.relatedSubtitle")}</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-900">
              {t("product.viewAllProducts")}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <div key={p._id} className="min-w-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
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
