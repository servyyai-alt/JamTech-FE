import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as productService from "../../services/productService.js";
import ProductCard from "../../components/ecommerce/ProductCard.jsx";
import SkeletonCard from "../../components/common/SkeletonCard.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import Pagination from "../../components/common/Pagination.jsx";
import "./shop-page.css";

const SORT_OPTIONS = [
  { value: "", labelKey: "sort.newest" },
  { value: "price_asc", labelKey: "sort.priceAsc" },
  { value: "price_desc", labelKey: "sort.priceDesc" },
  { value: "popular", labelKey: "sort.popular" },
];

const FilterPanel = ({ categories, filters, setFilters }) => {
  const { t } = useTranslation("shop");
  const activeCategory = categories.find((c) => c._id === filters.category);
  return (
    <div className="shop-filters">
      {/* Category Filter */}
      <div className="shop-filters__group">
        <span className="shop-filters__title">{t("filter.category")}</span>
        <div className="flex flex-col gap-1">
          {categories.map((c) => {
            const on = filters.category === c._id;
            return (
              <label key={c._id} className={`shop-filters__row ${on ? "shop-filters__row--on" : ""}`}>
                <span className="shop-filters__label">{c.name}</span>
                <span className="shop-filters__dot" aria-hidden="true" />
                <input type="radio" name="category" className="sr-only" checked={on} onChange={() => setFilters((f) => ({ ...f, category: c._id, page: 1 }))} />
              </label>
            );
          })}
          {activeCategory && (
            <button onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))} className="shop-filters__clear">
              {t("filter.clearCategory")}
            </button>
          )}
        </div>
      </div>

      <hr className="shop-filters__divider" />

      {/* Price Range */}
      <div className="shop-filters__group">
        <span className="shop-filters__title">{t("filter.priceRange")}</span>
        <div className="shop-filters__inputs">
          <input type="number" placeholder={t("filter.min")} value={filters.minPrice} onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value, page: 1 }))} />
          <span className="text-gray-300">-</span>
          <input type="number" placeholder={t("filter.max")} value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value, page: 1 }))} />
        </div>
      </div>

      <hr className="shop-filters__divider" />

      {/* Toggles */}
      <div className="flex flex-col gap-2">
        <label className="shop-filters__row">
          <span className="shop-filters__label">{t("filter.inStockOnly")}</span>
          <span className={`shop-filters__switch ${filters.inStock ? "shop-filters__switch--on" : ""}`} aria-hidden="true"><span className="shop-filters__knob" /></span>
          <input type="checkbox" className="sr-only" checked={filters.inStock} onChange={(e) => setFilters((f) => ({ ...f, inStock: e.target.checked, page: 1 }))} />
        </label>
        <label className="shop-filters__row">
          <span className="shop-filters__label">{t("filter.onSale")}</span>
          <span className={`shop-filters__switch ${filters.discount ? "shop-filters__switch--on" : ""}`} aria-hidden="true"><span className="shop-filters__knob" /></span>
          <input type="checkbox" className="sr-only" checked={filters.discount} onChange={(e) => setFilters((f) => ({ ...f, discount: e.target.checked, page: 1 }))} />
        </label>
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
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileFiltersOpen]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchParams.get("search") || "", page: 1 }));
  }, [searchParams]);

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

  const activeCategory = categories.find((c) => c._id === filters.category);

  return (
    <div className="container-px section-y mx-auto max-w-7xl">
      <header className="shop-hero">
        <span className="shop-hero__grid" aria-hidden="true" />
        <span className="shop-hero__glow shop-hero__glow--a" aria-hidden="true" />
        <span className="shop-hero__glow shop-hero__glow--b" aria-hidden="true" />
        <div className="shop-hero__copy">
          <span className="shop-hero__kicker">{t("hero.kicker")}</span>
          <h1 className="shop-hero__title">{t("title")} <span>{t("hero.highlight")}</span></h1>
          <p className="shop-hero__subtitle">{t("hero.subtitle")}</p>
          <div className="shop-hero__meta">
            <span className="shop-hero__count">
              <Package size={13} />
              {loading ? t("hero.loading") : t("results", { count: products.length })}
            </span>
            {activeCategory && (
              <span className="shop-hero__chip">
                {activeCategory.name}
                <button onClick={() => setFilters((f) => ({ ...f, category: "", page: 1 }))} aria-label={t("filter.clearCategory")} title={t("filter.clearCategory")}>
                  <X size={11} />
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="shop-hero__tools">
          <button onClick={() => setMobileFiltersOpen(true)} className="shop-filters-toggle lg:hidden">
            <SlidersHorizontal size={15} /> {t("filter.title")}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label={t("sort.label")} className="shop-hero__sort">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.labelKey)}</option>)}
          </select>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel categories={categories} filters={filters} setFilters={setFilters} />
        </aside>

        <div>
          {loading ? (
            <div className="shop-grid">
              {Array.from({ length: 8 }).map((_, i) => <div className="shop-grid__cell" style={{ "--i": i }} key={i}><SkeletonCard /></div>)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState title={t("empty.title")} description={t("empty.description")} />
          ) : (
            <>
              <div className="shop-grid">
                {products.map((p, i) => (
                  <div className="shop-grid__cell" style={{ "--i": i % 8 }} key={p._id}><ProductCard product={p} /></div>
                ))}
              </div>
              <Pagination page={meta.page} pages={meta.pages} onChange={(p) => {
                setFilters((f) => ({ ...f, page: p }));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} />
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="shop-drawer lg:hidden" onClick={(e) => { if (e.target === e.currentTarget) setMobileFiltersOpen(false); }}>
          <div className="shop-drawer__sheet">
            <div className="shop-drawer__grip" aria-hidden="true" />
            <div className="shop-drawer__head">
              <h3>{t("filter.title")}</h3>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label={t("filter.close")}><X size={20} /></button>
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
