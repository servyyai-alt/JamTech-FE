import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating = 0, size = 16, showValue = true, count }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <Star
        key={n}
        size={size}
        className={n <= Math.round(rating) ? "fill-gold-500 text-gold-500" : "fill-gray-200 text-gray-200"}
      />
    ))}
    {showValue && <span className="ml-1 text-sm text-gray-500">{rating?.toFixed(1)}{count != null && ` (${count})`}</span>}
  </div>
);

export default StarRating;
