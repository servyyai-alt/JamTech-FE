import React from "react";
import i18n from "../../i18n.js";

const formatPrice = (value, currency = "EUR") =>
  new Intl.NumberFormat(i18n.language?.toLowerCase().startsWith("fr") ? "fr-FR" : "en-IE", { style: "currency", currency }).format(value || 0);

const PriceTag = ({ regularPrice, salePrice, currency = "EUR", size = "md" }) => {
  const hasDiscount = salePrice && salePrice < regularPrice;
  const sizes = { sm: "text-base", md: "text-xl", lg: "text-2xl" };

  return (
    <div className="flex flex-wrap items-baseline gap-1.5">
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
