import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import RepairStepper from "../../components/service/RepairStepper.jsx";
import { Tag } from "lucide-react";

const RepairBrandSelect = () => {
  const { categorySlug } = useParams();
  const location = useLocation();
  const [category, setCategory] = useState(location.state?.category || null);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    catalogService.getDeviceCategories()
      .then(async (catRes) => {
        const cat = category || catRes.data.find((c) => c.slug === categorySlug);
        setCategory(cat);
        if (!cat) throw new Error("Category not found");
        const brandRes = await catalogService.getBrands(cat._id);
        setBrands(brandRes.data || []);
      })
      .catch(() => setError("Could not load brands for this category."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [categorySlug]);

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <RepairStepper current={1} />
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Choose Your Brand</h1>
        <p className="mt-1 text-gray-500">{category?.name}</p>
      </div>

      {loading ? <Loader /> : error ? <ErrorState message={error} /> : brands.length === 0 ? (
        <EmptyState title="No brands available yet" description="Please check back soon or contact support." />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {brands.map((brand) => (
            <Link key={brand._id} to={`/repair/${categorySlug}/${brand.slug}`} state={{ category, brand }} className="card flex flex-col items-center gap-3 p-6 text-center hover:-translate-y-1">
              {brand.logo ? <img src={brand.logo} alt={brand.name} className="h-12 object-contain" /> : <Tag className="text-primary-600" size={28} />}
              <span className="font-display font-semibold">{brand.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default RepairBrandSelect;
