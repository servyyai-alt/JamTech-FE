import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Truck, ShieldCheck, RotateCcw, Minus, Plus, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as productService from "../../services/productService.js";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as authService from "../../services/authService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import StarRating from "../../components/common/StarRating.jsx";
import PriceTag from "../../components/common/PriceTag.jsx";
import ProductCard from "../../components/ecommerce/ProductCard.jsx";

const ProductDetails = () => {
  const { t } = useTranslation("shop");
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
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
      productService.getProductReviews(data.product._id).then((res) => setReviews(res.data || []));
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
      quantity,
    });
    showToast(t("product.addedToCart"), "success");
  };

  const handleWishlist = async () => {
    if (!user) return showToast(t("wishlist.loginRequired"), "info");
    await authService.toggleWishlist(product._id);
    await refreshUser();
    showToast(t("wishlist.updated"), "success");
  };

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

          <div className="mt-5"><PriceTag regularPrice={selectedVariant?.price || product.regularPrice} salePrice={selectedVariant?.discountPrice || product.salePrice} size="lg" /></div>
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
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">{t("product.noReviews")}</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="border-b border-gray-100 pb-4">
                  <StarRating rating={r.rating} size={13} showValue={false} />
                  <p className="mt-1 text-sm font-semibold">{r.user?.name}</p>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
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
    </div>
  );
};
export default ProductDetails;
