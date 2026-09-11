import React from "react";

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="aspect-square w-full animate-pulse bg-gray-100" />
    <div className="space-y-2 p-4">
      <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
    </div>
  </div>
);

export default SkeletonCard;
