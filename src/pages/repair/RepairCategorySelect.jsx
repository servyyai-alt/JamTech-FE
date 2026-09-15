import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Tablet, Laptop, Gamepad2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";

const ICONS = { Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, "Gaming Devices": Gamepad2 };

const RepairCategorySelect = () => {
  const { t } = useTranslation("repair");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    catalogService.getDeviceCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setError(t("error.loadCategories")))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 md:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-gray-500">{t("step1Subtitle")}</p>
      </div>

      {loading ? <Loader /> : error ? <ErrorState message={error} onRetry={load} /> : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {categories.map((cat) => {
            const Icon = ICONS[cat.name] || Smartphone;
            return (
              <Link key={cat._id} to={`/repair/${cat.slug}`} state={{ category: cat }} className="card group flex flex-col items-center gap-4 p-8 text-center hover:-translate-y-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-gold-50 text-primary-600 transition group-hover:scale-110">
                  <Icon size={32} />
                </div>
                <span className="font-display text-lg font-semibold">{cat.name}</span>
                <span className="flex items-center gap-1 text-sm font-medium text-primary-600">{t("continue")} <ArrowRight size={14} /></span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default RepairCategorySelect;
