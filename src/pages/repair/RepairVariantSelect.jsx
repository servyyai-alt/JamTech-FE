import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import RepairStepper from "../../components/service/RepairStepper.jsx";
import { ArrowRight } from "lucide-react";

// Some models have no variants (e.g. consoles) — in that case we skip straight to repair selection.
const RepairVariantSelect = () => {
  const { categorySlug, brandSlug, modelSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("repair");
  const { category, brand } = location.state || {};
  const [model, setModel] = useState(location.state?.model || null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        let m = model;
        if (!m) {
          const brandRes = await catalogService.getBrands();
          const b = brandRes.data.find((br) => br.slug === brandSlug);
          const modelRes = await catalogService.getModels(b._id);
          m = modelRes.data.find((md) => md.slug === modelSlug);
          setModel(m);
        }
        const variantRes = await catalogService.getVariants(m._id);
        if (!variantRes.data || variantRes.data.length === 0) {
          navigate(`/repair/${categorySlug}/${brandSlug}/${modelSlug}/service`, { state: { category, brand, model: m }, replace: true });
          return;
        }
        setVariants(variantRes.data);
      } catch {
        setError(t("error.loadVariants"));
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, [modelSlug]);

  const selectVariant = (variant) => {
    navigate(`/repair/${categorySlug}/${brandSlug}/${modelSlug}/service`, { state: { category, brand, model, variant } });
  };

  if (loading) return <Loader full />;
  if (error) return <div className="container-px section-y mx-auto max-w-4xl"><ErrorState message={error} /></div>;

  return (
    <div className="container-px section-y mx-auto max-w-4xl">
      <RepairStepper current={3} />
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-gray-500">{model?.name}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {variants.map((v) => (
          <button key={v._id} onClick={() => selectVariant(v)} className="card flex items-center justify-between p-5 text-left hover:-translate-y-0.5">
            <span className="font-medium">{v.label}</span>
            <ArrowRight size={16} className="text-primary-600" />
          </button>
        ))}
        <button onClick={() => navigate("/repair/manual-quote", { state: { category, brand, model } })} className="card flex items-center justify-between border-dashed p-5 text-left hover:-translate-y-0.5 bg-gray-50/50">
          <span className="font-medium text-ink-900">{t("variantNotListed", "Other (Not Listed)")}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm"><span className="text-lg leading-none">+</span></span>
        </button>
      </div>
    </div>
  );
};
export default RepairVariantSelect;
