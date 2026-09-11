import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import ProductCard from "../../components/ecommerce/ProductCard.jsx";

const ProfileWishlist = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.wishlist?.length) { setLoading(false); return; }
    Promise.all(user.wishlist.map((id) => api.get(`/products/${id}`)))
      .then((results) => setProducts(results.map((r) => r.data.data)))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loader />;
  if (products.length === 0) return <EmptyState title="Your wishlist is empty" />;

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
};
export default ProfileWishlist;
