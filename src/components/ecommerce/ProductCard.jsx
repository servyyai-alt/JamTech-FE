import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import PriceTag from "../common/PriceTag.jsx";
import StarRating from "../common/StarRating.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as authService from "../../services/authService.js";

const ProductCard = ({ product }) => {
  const { t } = useTranslation("shop");
  const { addItem } = useCart();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    addItem({
      productId: product._id,
      title: product.title,
      image: product.images?.[0],
      price: product.salePrice && product.salePrice < product.regularPrice ? product.salePrice : product.regularPrice,
      quantity: 1,
    });
    showToast(t("product.addedToCart"), "success");
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return showToast(t("wishlist.loginRequired"), "info");
    try {
      await authService.toggleWishlist(product._id);
      await refreshUser();
      showToast(t("wishlist.updated"), "success");
    } catch {
      showToast(t("wishlist.failed"), "error");
    }
  };

  const isWishlisted = user?.wishlist?.includes(product._id);

  return (
    <Link to={`/product/${product.slug}`} className="card group relative flex flex-col overflow-hidden">
      <button
        onClick={handleWishlist}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110"
      >
        <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
      </button>
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images?.[0] || "https://via.placeholder.com/400"}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        {product.brand && <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{product.brand}</span>}
        <h3 className="line-clamp-2 font-display text-sm font-semibold text-ink-900">{product.title}</h3>
        {product.numReviews > 0 && <StarRating rating={product.rating} size={12} count={product.numReviews} />}
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag regularPrice={product.regularPrice} salePrice={product.salePrice} size="sm" />
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 text-white transition hover:bg-primary-600 disabled:opacity-30"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
        {product.stock <= 0 && <span className="text-xs font-semibold text-red-500">{t("product.outOfStock")}</span>}
      </div>
    </Link>
  );
};

export default ProductCard;
