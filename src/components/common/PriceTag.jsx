import React from "react";

const formatPrice = (value, currency = "EUR") =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(value || 0);

const PriceTag = ({ regularPrice, salePrice, currency = "EUR", size = "md" }) => {
  const hasDiscount = salePrice && salePrice < regularPrice;
  const sizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

  return (
    <div className="flex items-center gap-2">
      <span className={`font-display font-bold text-ink-900 ${sizes[size]}`}>
        {formatPrice(hasDiscount ? salePrice : regularPrice, currency)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-gray-400 line-through">{formatPrice(regularPrice, currency)}</span>
          <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">
            -{Math.round(((regularPrice - salePrice) / regularPrice) * 100)}%
          </span>
        </>
      )}
    </div>
  );
};

export default PriceTag;
export { formatPrice };
