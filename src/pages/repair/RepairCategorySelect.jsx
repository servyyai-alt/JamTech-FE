import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Tablet, Laptop, Gamepad2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as catalogService from "../../services/catalogService.js";
import Loader from "../../components/common/Loader.jsx";
import ErrorState from "../../components/common/ErrorState.jsx";

import catPhoneImg from "../../assets/cat_phone.jpg";
import catTabletImg from "../../assets/cat_tablet.jpg";
import catComputerImg from "../../assets/cat_computer.jpg";
import catLaptopImg from "../../assets/cat_laptop.jpg";
import catGamingImg from "../../assets/cat_gaming.jpg";

const ICONS = { Smartphones: Smartphone, Tablets: Tablet, Computers: Laptop, "Gaming Devices": Gamepad2 };
const CATEGORY_IMAGES = {
  "Smartphones": catPhoneImg,
  "Tablets": catTabletImg,
  "Computers": catComputerImg,
  "Laptops": catLaptopImg,
  "Laptop": catLaptopImg,
  "laptop": catLaptopImg,
  "Gaming Devices": catGamingImg,
};

const RepairCategorySelect = () => {
  const { t } = useTranslation("repair");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    catalogService.getDeviceCategories()
      .then((res) => {
        // Fallback to ensuring Laptops is in the list if missing from API, just to match the visual
        let fetched = res.data || [];
        if (!fetched.find(c => c.name.toLowerCase() === 'laptops' || c.name.toLowerCase() === 'laptop')) {
            fetched.splice(1, 0, { _id: 'fake-laptop', name: 'Laptops', slug: 'laptops' });
        }
        setCategories(fetched);
      })
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((cat) => {
            const catImg = CATEGORY_IMAGES[cat.name] || catPhoneImg;
            return (
              <Link key={cat._id} to={`/repair/${cat.slug}`} state={{ category: cat }} className="group flex flex-col overflow-hidden text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-primary-500 bg-white" style={{ borderRadius: 20 }}>
                <div className="flex h-[170px] w-full items-center justify-center overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img src={catImg} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105" />
                </div>
                <div className="flex flex-col gap-2 p-6 flex-grow justify-center">
                  <span className="font-display text-lg font-bold text-ink-900" style={{ fontFamily: "'Syne', sans-serif" }}>{cat.name}</span>
                  <span className="flex items-center justify-center gap-1 text-sm font-semibold text-primary-600 mt-1">{t("continue")} <ArrowRight size={14} /></span>
                </div>
              </Link>
            );
          })}
          <Link to="/repair/manual-quote" className="group flex flex-col items-center justify-center gap-4 text-center hover:-translate-y-1 transition-all duration-300 border-2 border-dashed border-gray-200 hover:border-primary-500 hover:bg-primary-50/50 bg-gray-50/50 min-h-[250px]" style={{ borderRadius: 20 }}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-primary-600 shadow-sm transition-transform group-hover:scale-110">
              <span className="text-3xl">+</span>
            </div>
            <div className="px-4">
              <span className="block font-display text-lg font-bold text-ink-900 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{t("categoryNotListed", "Other Device")}</span>
              <span className="text-sm font-medium text-gray-500">Request a custom quote</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
export default RepairCategorySelect;
