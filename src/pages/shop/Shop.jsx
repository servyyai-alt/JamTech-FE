import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as productService from "../../services/productService.js";
import ProductCard from "../../components/ecommerce/ProductCard.jsx";
import SkeletonCard from "../../components/common/SkeletonCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Pagination from "../../components/common/Pagination.jsx";

const SORT_OPTIONS = [
  { value: "", labelKey: "sort.newest" },
  { value: "price_asc", labelKey: "sort.priceAsc" },
  { value: "price_desc", labelKey: "sort.priceDesc" },
  { value: "popular", labelKey: "sort.popular" },
  { value: "rating", labelKey: "sort.rating" },
];

const FilterPanel = ({ categories, filters, setFilters }) => {
  const { t } = useTranslation("shop");
  return (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 font-display font-semibold">{t("filter.category")}</h4>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c._id} className="flex items-center gap-2 text-sm">
              <input type="radio" name="category" checked={filters.category === c._id} onChange={() => setFilters((f) => ({ ...f, category: c._id, page: 1 }))} />
              {c.name}
            </label>
          ))}
          {filters.category && (
            <button onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))} className="text-xs font-medium text-primary-600">{t("filter.clearCategory")}</button>
          )}
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">{t("filter.priceRange")}</h4>
        <div className="flex items-center gap-2">
          <input type="number" placeholder={t("filter.min")} className="input !py-2 text-sm" value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value, page: 1 }))} />
          <span className="text-gray-400">–</span>
          <input type="number" placeholder={t("filter.max")} className="input !py-2 text-sm" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value, page: 1 }))} />
        </div>
      </div>
      <div>
        <h4 className="mb-3 font-display font-semibold">{t("filter.rating")}</h4>
        {[4, 3, 2].map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm">
            <input type="radio" name="rating" checked={String(filters.minRating) === String(r)} onChange={() => setFilters((f) => ({ ...f, minRating: r, page: 1 }))} />
            {t("filter.ratingAndUp", { count: r })}
          </label>
        ))}
        {filters.minRating && <button onClick={() => setFilters((f) => ({ ...f, minRating: "", page: 1 }))} className="mt-1 text-xs font-medium text-primary-600">{t("filter.clearRating")}</button>}
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.inStock} onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked, page: 1 }))} /> {t("filter.inStockOnly")}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.discount} onChange={(e) => setFilters((f) => ({ ...f, discount: e.target.checked, page: 1 }))} /> {t("filter.onSale")}</label>
      </div>
    </div>
  );
};

const Shop = () => {
  const { t } = useTranslation("shop");
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState("");
  const [filters, setFilters] = useState({
    category: "", minPrice: "", maxPrice: "", minRating: "", inStock: false, discount: false, page: 1,
    search: searchParams.get("search") || "",
  });

  useEffect(() => {
    productService.getCategories().then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { ...filters, sort, limit: 12 };
    Object.keys(params).forEach((k) => (params[k] === "" || params[k] === false) && delete params[k]);
    productService.getProducts(params)
      .then((res) => {
        setProducts(res.data || []);
        setMeta({ page: res.page, pages: res.pages });
      })
      .finally(() => setLoading(false));
  }, [filters, sort]);

  return (
    <div className="container-px section-y mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink-900">{t("title")}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileFiltersOpen(true)} className="btn-secondary !px-4 !py-2 text-sm lg:hidden"><SlidersHorizontal size={15} /> {t("filter.title")}</button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto !py-2 text-sm">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel categories={categories} filters={filters} setFilters={setFilters} />
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState title={t("empty.title")} description={t("empty.description")} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination page={meta.page} pages={meta.pages} onChange={(p) => setFilters((f) => ({ ...f, page: p }))} />
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 lg:hidden">
          <div className="max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display font-semibold">{t("filter.title")}</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
            </div>
            <FilterPanel categories={categories} filters={filters} setFilters={setFilters} />
            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary mt-6 w-full">{t("filter.applyFilters")}</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Shop;
