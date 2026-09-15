import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import RepairStepper from "../../components/service/RepairStepper.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { Wrench, Clock, ShieldCheck } from "lucide-react";

const RepairServiceSelect = () => {
  const { categorySlug, brandSlug, modelSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation("repair");
  const { category, brand, model, variant } = location.state || {};
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category || !brand || !model) {
      setError(t("error.missingSelection"));
      setLoading(false);
      return;
    }
    setLoading(true);
    catalogService
      .getRepairServices({ category: category._id, brand: brand._id, model: model._id })
      .then(async (res) => {
        setServices(res.data || []);
        const priceMap = {};
        await Promise.all(
          (res.data || []).map(async (svc) => {
            try {
              const params = { category: category._id, brand: brand._id, model: model._id, service: svc._id };
              if (variant) params.variant = variant._id;
              const priceRes = await catalogService.getRepairPriceLookup(params);
              priceMap[svc._id] = priceRes.data;
            } catch {
              priceMap[svc._id] = null;
            }
          })
        );
        setPrices(priceMap);
      })
      .catch(() => setError(t("error.loadServices")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [modelSlug]);

  const selectService = (service) => {
    const price = prices[service._id];
    if (price?.isQuoteOnly) {
      navigate("/repair/manual-quote", { state: { category, brand, model, variant, service } });
      return;
    }
    if (!price) return;
    navigate("/repair/booking", { state: { category, brand, model, variant, service, price } });
  };

  if (loading) return <Loader full />;
  if (error) return <div className="container-px section-y mx-auto max-w-4xl"><ErrorState message={error} /></div>;

  const availableServices = services.filter((s) => prices[s._id]);

  return (
    <div className="container-px section-y mx-auto max-w-5xl">
      <RepairStepper current={4} />
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-gray-500">{brand?.name} {model?.name} {variant ? `· ${variant.label}` : ""}</p>
      </div>

      {availableServices.length === 0 ? (
        <div className="space-y-4 text-center">
          <EmptyState title={t("empty.title")} description={t("empty.description")} />
          <button onClick={() => navigate("/repair/manual-quote", { state: { category, brand, model, variant } })} className="btn-primary">
            {t("requestManualQuote")}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {availableServices.map((s) => {
            const price = prices[s._id];
            return (
              <button key={s._id} onClick={() => selectService(s)} className="card flex flex-col gap-2 p-6 text-left hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Wrench size={18} /></div>
                  <span className="font-display text-lg font-bold text-ink-900">{price.isQuoteOnly ? t("requestQuote") : formatPrice(price.finalPrice ?? price.regularPrice)}</span>
                </div>
                <h3 className="font-display font-semibold">{s.name}</h3>
                {s.shortDescription && <p className="text-sm text-gray-500">{s.shortDescription}</p>}
                {price.isQuoteOnly && <p className="text-xs font-medium text-primary-600">{t("noFixedPrice")}</p>}
                <div className="mt-2 flex gap-4 text-xs text-gray-400">
                  {s.estimatedTime && <span className="flex items-center gap-1"><Clock size={12} /> {s.estimatedTime}</span>}
                  {s.warranty && <span className="flex items-center gap-1"><ShieldCheck size={12} /> {s.warranty}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
      {availableServices.length > 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-primary-200 bg-primary-50/50 p-5 text-center">
          <h2 className="font-display font-semibold text-ink-900">{t("cantFindTitle")}</h2>
          <p className="mt-1 text-sm text-gray-600">{t("cantFindDescription")}</p>
          <button onClick={() => navigate("/repair/manual-quote", { state: { category, brand, model, variant } })} className="btn-secondary mt-4 !px-4 !py-2 text-sm">
            {t("requestManualQuote")}
          </button>
        </div>
      )}
    </div>
  );
};
export default RepairServiceSelect;
