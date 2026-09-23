import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Wrench, Package, Menu, X, LogOut, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";
import logo from "../../assets/logo_new.png";

const navLinks = [
  { to: "/", key: "home" },
  { to: "/repair", key: "repairServices" },
  { to: "/shop", key: "shop" },
  { to: "/about", key: "about" },
  { to: "/contact", key: "contact" },
];

const Navbar = () => {
  const { t } = useTranslation("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all ${scrolled ? "bg-white/95 shadow-md backdrop-blur" : "bg-white"}`}>
      <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={logo} alt="JAM Smart Tech" className="h-14 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-ink-700 transition hover:text-primary-600">
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="relative hidden max-w-sm flex-1 md:block group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="text-gray-400 transition-colors group-focus-within:text-primary-500" size={18} />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border-2 border-gray-100 bg-gray-50/80 py-2.5 pl-11 pr-24 text-sm font-medium text-ink-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]"
          />
          <button type="submit" className="absolute inset-y-1.5 right-1.5 flex items-center justify-center rounded-full bg-primary-600 px-4 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-95">
            Search
          </button>
        </form>

        <div className="flex items-center gap-1.5">
          <Link to="/track-repair" title={t("trackRepair")} className="hidden rounded-full p-2 text-ink-700 hover:bg-gray-100 md:inline-flex">
            <Wrench size={20} />
          </Link>
          <Link to="/track-order" title={t("trackOrder")} className="hidden rounded-full p-2 text-ink-700 hover:bg-gray-100 md:inline-flex">
            <Package size={20} />
          </Link>
          <Link to="/profile/wishlist" title={t("wishlist")} aria-label={t("wishlist")} className="relative rounded-full p-2 text-ink-700 hover:bg-gray-100">
            <Heart size={20} />
            {!!user?.wishlist?.length && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
                {user.wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 text-ink-700 hover:bg-gray-100">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="group relative hidden md:block">
              <button className="flex items-center gap-1 rounded-full p-2 text-ink-700 hover:bg-gray-100">
                <User size={20} />
              </button>
              <div className="invisible absolute right-0 mt-1 w-48 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-premium transition group-hover:visible group-hover:opacity-100">
                <p className="truncate px-3 py-1 text-xs text-gray-400">{user.email}</p>
                <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">{t("profile")}</Link>
                <Link to="/profile/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">{t("orders")}</Link>
                <Link to="/profile/repairs" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">{t("repairBookings")}</Link>
                {user.role === "admin" && <Link to="/admin" className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-50">{t("adminDashboard")}</Link>}
                <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={14} /> {t("logout")}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden rounded-full p-2 text-ink-700 hover:bg-gray-100 md:inline-flex">
              <User size={20} />
            </Link>
          )}

          <LanguageSwitcher className="ml-1 hidden md:inline-flex" />

          <button className="rounded-full p-2 text-ink-700 hover:bg-gray-100 lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search")} className="input pl-9" />
          </form>
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">
                {t(l.key)}
              </Link>
            ))}
            <Link to="/track-repair" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">{t("trackRepair")}</Link>
            <Link to="/track-order" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">{t("trackOrder")}</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">{t("profile")}</Link>
                {user.role === "admin" && <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-600 hover:bg-gray-50">{t("adminDashboard")}</Link>}
                <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">{t("logout")}</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">{t("loginRegister")}</Link>
            )}
          </div>
          <div className="mt-3 flex justify-center">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

