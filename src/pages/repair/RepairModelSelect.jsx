import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import RepairStepper from "../../components/service/RepairStepper.jsx";
import { Smartphone } from "lucide-react";

const RepairModelSelect = () => {
  const { categorySlug, brandSlug } = useParams();
  const location = useLocation();
  const [category] = useState(location.state?.category);
  const [brand, setBrand] = useState(location.state?.brand || null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        let b = brand;
        if (!b) {
          const catRes = await catalogService.getDeviceCategories();
          const cat = catRes.data.find((c) => c.slug === categorySlug);
          const brandRes = await catalogService.getBrands(cat._id);
          b = brandRes.data.find((br) => br.slug === brandSlug);
          setBrand(b);
        }
        const modelRes = await catalogService.getModels(b._id);
        setModels(modelRes.data || []);
      } catch {
        setError("Could not load models for this brand.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [brandSlug]);

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <RepairStepper current={2} />
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">Choose Your Model</h1>
        <p className="mt-1 text-gray-500">{brand?.name}</p>
      </div>

      {loading ? <Loader /> : error ? <ErrorState message={error} /> : models.length === 0 ? (
        <EmptyState title="No models available yet" />
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {models.map((model) => (
            <Link
              key={model._id}
              to={`/repair/${categorySlug}/${brandSlug}/${model.slug}`}
              state={{ category, brand, model }}
              className="card flex flex-col items-center gap-3 p-6 text-center hover:-translate-y-1"
            >
              {model.image ? <img src={model.image} alt={model.name} className="h-16 w-16 object-contain" /> : <Smartphone className="text-primary-600" size={32} />}
              <span className="font-display text-sm font-semibold">{model.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default RepairModelSelect;
