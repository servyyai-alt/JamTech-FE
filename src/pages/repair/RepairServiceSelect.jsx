import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import RepairStepper from "../../components/service/RepairStepper.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";
import { Wrench, Clock, ShieldCheck, ArrowRight, Smartphone, Tablet, Laptop, Gamepad2 } from "lucide-react";
import "./repair-service-select.css";

const CATEGORY_ICONS = { Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, "Gaming Devices": Gamepad2 };

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
  const DeviceIcon = CATEGORY_ICONS[category?.name] || Smartphone;

  return (
    <div className="container-px section-y mx-auto max-w-5xl">
      <RepairStepper current={4} />
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-900 md:text-3xl">{t("title")}</h1>
        <p className="mt-1 text-gray-500">{t("step4Subtitle")}</p>
      </div>

      <div className="svc-pick">
        <div className="svc-pick__device">
          <span className="svc-pick__device-icon"><DeviceIcon size={22} /></span>
          <span className="svc-pick__device-copy">
            <span className="svc-pick__device-kicker">{t("device")}</span>
            <span className="svc-pick__device-name">{brand?.name} {model?.name}</span>
            {variant && <span className="svc-pick__device-variant">{variant.label}</span>}
          </span>
          <span className="svc-pick__device-side">
            <span className="svc-pick__count">{t("availableRepairs", { count: availableServices.length })}</span>
            <button
              type="button"
              onClick={() => navigate(`/repair/${categorySlug}/${brandSlug}/${modelSlug}`, { state: { category, brand, model } })}
              className="svc-pick__change"
            >
              {t("changeDevice")} <ArrowRight size={13} />
            </button>
          </span>
        </div>

        {availableServices.length === 0 ? (
          <div className="space-y-4 text-center">
            <EmptyState title={t("empty.title")} description={t("empty.description")} />
            <button onClick={() => navigate("/repair/manual-quote", { state: { category, brand, model, variant } })} className="btn-primary">
              {t("requestManualQuote")}
            </button>
          </div>
        ) : (
          <div className="svc-pick__grid">
            {availableServices.map((s, i) => {
              const price = prices[s._id];
              return (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => selectService(s)}
                  className="svc-pick__card"
                  style={{ "--i": i }}
                >
                  <span className="svc-pick__card-bar" aria-hidden="true" />
                  <span className="svc-pick__card-head">
                    <span className="svc-pick__icon"><Wrench size={20} /></span>
                    <span className={`svc-pick__price ${price.isQuoteOnly ? "svc-pick__price--quote" : ""}`}>
                      <strong>{price.isQuoteOnly ? t("requestQuote") : formatPrice(price.finalPrice ?? price.regularPrice)}</strong>
                      {!price.isQuoteOnly && <span>{t("startingFrom")}</span>}
                    </span>
                  </span>
                  <span className="svc-pick__title">{s.name}</span>
                  {s.shortDescription && <span className="svc-pick__desc">{s.shortDescription}</span>}
                  {price.isQuoteOnly && <span className="svc-pick__note">{t("noFixedPrice")}</span>}
                  {(s.estimatedTime || s.warranty) && (
                    <span className="svc-pick__meta">
                      {s.estimatedTime && <span className="svc-pick__chip"><Clock size={12} /> {s.estimatedTime}</span>}
                      {s.warranty && <span className="svc-pick__chip"><ShieldCheck size={12} /> {s.warranty}</span>}
                    </span>
                  )}
                  <span className="svc-pick__cta">
                    {t("selectRepair")}
                    <span className="svc-pick__cta-arrow" aria-hidden="true"><ArrowRight size={15} /></span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {availableServices.length > 0 && (
          <div className="svc-pick__fallback" style={{ "--i": availableServices.length }}>
            <div>
              <h2>{t("cantFindTitle")}</h2>
              <p>{t("cantFindDescription")}</p>
            </div>
            <button onClick={() => navigate("/repair/manual-quote", { state: { category, brand, model, variant } })} className="btn-secondary !px-5 !py-2.5 text-sm">
              {t("requestManualQuote")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default RepairServiceSelect;
