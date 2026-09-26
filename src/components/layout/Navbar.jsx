import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Heart,
  LogOut,
  Menu,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import LanguageSwitcher, { LanguageToggle } from "../common/LanguageSwitcher.jsx";
import logo from "../../assets/logo_new.png";
import "./navbar.css";

const navLinks = [
  { to: "/", key: "home" },
  { to: "/repair", key: "repairServices" },
  { to: "/shop", key: "shop" },
  { to: "/about", key: "about" },
  { to: "/contact", key: "contact" },
];

export default function Navbar() {
  const { t } = useTranslation("nav");
  const [scrolled, setScrolled] = useState(false);
  const [panel, setPanel] = useState(null);
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    let frameId;
    const updateNavigation = () => {
      const scrollTop = window.scrollY;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollRange > 0 ? Math.min(scrollTop / scrollRange, 1) : 0;
      setScrolled(scrollTop > 18);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
      frameId = null;
    };
    const onScroll = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => { setPanel(null); }, [location.pathname, location.search]);
  useEffect(() => { if (panel === "search") searchRef.current?.focus(); }, [panel]);
  useEffect(() => {
    if (!panel) return undefined;
    const outside = (event) => {
      if (!headerRef.current?.contains(event.target)) setPanel(null);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setPanel(null);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [panel]);
  useEffect(() => {
    if (panel !== "mobile") return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [panel]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1320px)");
    const close = () => setPanel(null);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  const toggle = (name, event) => {
    triggerRef.current = event.currentTarget;
    setPanel((current) => current === name ? null : name);
  };
  const close = () => setPanel(null);
  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    setSearch("");
    setPanel(null);
  };
  const signOut = () => {
    logout();
    setPanel(null);
  };

  const accountName = user?.name || t("profile");
  const accountInitials = accountName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const trackingItems = [
    { to: "/track-repair", label: t("trackRepair"), icon: Wrench },
    { to: "/track-order", label: t("trackOrder"), icon: Package },
  ];
  const accountItems = user
    ? [
        { to: "/profile", label: t("profile"), icon: User },
        { to: "/profile/orders", label: t("orders"), icon: Package },
        { to: "/profile/repairs", label: t("repairBookings"), icon: Wrench },
        ...(user.role === "admin" ? [{ to: "/admin", label: t("adminDashboard"), icon: ShieldCheck }] : []),
      ]
    : [{ to: "/login", label: t("loginRegister"), icon: User }];
  const mobileLinks = [
    ...trackingItems,
    { to: "/cart", label: t("footer.cart"), icon: ShoppingCart, count: itemCount },
    { to: "/profile/wishlist", label: t("wishlist"), icon: Heart, count: user?.wishlist?.length || 0 },
    ...accountItems,
  ];

  return (
    <header
      ref={headerRef}
      className={`site-nav ${scrolled ? "site-nav--scrolled" : ""} ${panel === "mobile" ? "site-nav--menu-open" : ""}`}
    >
      <span className="site-nav__ambient" aria-hidden="true" />
      <span ref={progressRef} className="site-nav__progress" aria-hidden="true" />

      <div className="site-nav__bar">
        <Link to="/" onClick={close} className="site-nav__brand" aria-label={`JAM Smart Tech — ${t("home")}`}>
          <span className="site-nav__brand-orbit" aria-hidden="true" />
          <span className="site-nav__brand-image"><img src={logo} alt="JAM Smart Tech" /></span>
        </Link>

        <nav className="site-nav__links" aria-label={t("mainNavigation")}>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/"} className={({ isActive }) => isActive ? "is-active" : ""}>
              <span>{t(link.key)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="site-nav__actions">
          <button type="button" className="site-nav__icon" onClick={(event) => toggle("search", event)} aria-label={t("searchAction")} aria-haspopup="true" aria-expanded={panel === "search"} aria-controls="nav-search">
            <Search size={18} /><span className="site-nav__tooltip" aria-hidden="true">{t("searchAction")}</span>
          </button>
          <div className="site-nav__desktop site-nav__anchor">
            <button type="button" className="site-nav__icon" onClick={(event) => toggle("tracking", event)} aria-label={t("tracking")} aria-haspopup="true" aria-expanded={panel === "tracking"} aria-controls="nav-tracking">
              <Package size={18} /><span className="site-nav__tooltip" aria-hidden="true">{t("tracking")}</span>
            </button>
            {panel === "tracking" && (
              <div id="nav-tracking" className="site-nav__dropdown site-nav__tracking-menu">
                <div className="site-nav__dropdown-heading">
                  <span><Package size={17} /></span>
                  <div><small>JAM / 01</small><p>{t("tracking")}</p></div>
                </div>
                <div className="site-nav__dropdown-links">
                  {trackingItems.map(({ to, label, icon: Icon }) => (
                    <Link to={to} onClick={close} className="site-nav__dropdown-link" key={to}>
                      <span><Icon size={17} /></span><b>{label}</b><ChevronRight size={15} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link to="/profile/wishlist" onClick={close} className="site-nav__icon site-nav__wishlist" aria-label={t("wishlist")}>
            <Heart size={18} />
            {!!user?.wishlist?.length && <span key={`wishlist-${user.wishlist.length}`} className="site-nav__count">{user.wishlist.length > 99 ? "99+" : user.wishlist.length}</span>}
            <span className="site-nav__tooltip" aria-hidden="true">{t("wishlist")}</span>
          </Link>
          <Link to="/cart" onClick={close} className="site-nav__icon site-nav__cart" aria-label={`${t("footer.cart")}${itemCount ? ` (${itemCount})` : ""}`}>
            <ShoppingCart size={18} />
            {itemCount > 0 && <span key={`cart-${itemCount}`} className="site-nav__count">{itemCount > 99 ? "99+" : itemCount}</span>}
            <span className="site-nav__tooltip" aria-hidden="true">{t("footer.cart")}</span>
          </Link>
          <div className="site-nav__desktop site-nav__anchor">
            <button type="button" className="site-nav__icon" onClick={(event) => toggle("account", event)} aria-label={user ? t("profile") : t("loginRegister")} aria-haspopup="true" aria-expanded={panel === "account"} aria-controls="nav-account">
              <User size={18} /><span className="site-nav__tooltip" aria-hidden="true">{user ? t("profile") : t("loginRegister")}</span>
            </button>
            {panel === "account" && (
              <div className="site-nav__dropdown site-nav__account-menu" id="nav-account">
                {user ? (
                  <div className="site-nav__account-summary">
                    <span>{accountInitials}</span>
                    <div><strong>{accountName}</strong><small>{user.email}</small></div>
                  </div>
                ) : (
                  <div className="site-nav__dropdown-heading site-nav__account-heading">
                    <span><User size={17} /></span>
                    <div><small>JAM / 02</small><p>{t("loginRegister")}</p></div>
                  </div>
                )}
                <div className="site-nav__dropdown-links">
                  {accountItems.map(({ to, label, icon: Icon }) => (
                    <Link to={to} onClick={close} className="site-nav__dropdown-link" key={to}>
                      <span><Icon size={17} /></span><b>{label}</b><ChevronRight size={15} />
                    </Link>
                  ))}
                  {user && <button type="button" onClick={signOut} className="site-nav__dropdown-link site-nav__logout"><span><LogOut size={17} /></span><b>{t("logout")}</b><ChevronRight size={15} /></button>}
                </div>
              </div>
            )}
          </div>
          <LanguageToggle />
          <LanguageSwitcher className="site-nav__language site-nav__desktop" />
          <Link to="/repair" className="site-nav__book site-nav__desktop"><span>{t("footer.bookRepair")}</span><i><ArrowRight size={15} /></i></Link>
          <button type="button" className="site-nav__icon site-nav__menu-button" onClick={(event) => toggle("mobile", event)} aria-label={t(panel === "mobile" ? "closeMenu" : "openMenu")} aria-expanded={panel === "mobile"} aria-controls="nav-mobile">
            {panel === "mobile" ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {panel === "search" && (
        <div className="site-nav__search-panel" id="nav-search">
          <span className="site-nav__search-scan" aria-hidden="true" />
          <form onSubmit={handleSearch} role="search">
            <span className="site-nav__search-icon"><Search size={20} aria-hidden="true" /></span>
            <input ref={searchRef} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("productSearchPlaceholder")} aria-label={t("productSearchPlaceholder")} />
            <button type="submit" disabled={!search.trim()}><span>{t("searchAction")}</span><ArrowRight size={16} /></button>
          </form>
        </div>
      )}

      {panel === "mobile" && (
        <div className="site-nav__mobile-panel" id="nav-mobile">
          <div className="site-nav__mobile-topline">
            <p><span />{t("footer.serviceStatus")}</p>
            <b>JAM / MOBILE</b>
          </div>

          <form onSubmit={handleSearch} className="site-nav__mobile-search" role="search">
            <span><Search size={18} /></span>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t("productSearchPlaceholder")} aria-label={t("productSearchPlaceholder")} />
            <button type="submit" disabled={!search.trim()} aria-label={t("searchAction")}><ArrowRight size={18} /></button>
          </form>

          <div className="site-nav__mobile-heading"><span>{t("mainNavigation")}</span><i /></div>
          <nav className="site-nav__mobile-links" aria-label={t("mainNavigation")}>
            {navLinks.map((link, index) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} onClick={close} className={({ isActive }) => isActive ? "is-active" : ""}>
                <span className="site-nav__mobile-number">0{index + 1}</span>
                <span className="site-nav__mobile-label">{t(link.key)}</span>
                <span className="site-nav__mobile-arrow"><ArrowRight size={17} /></span>
              </NavLink>
            ))}
          </nav>

          <Link to="/repair" onClick={close} className="site-nav__book site-nav__mobile-book"><span>{t("footer.bookRepair")}</span><i><ArrowRight size={17} /></i></Link>

          <div className="site-nav__mobile-heading"><span>{t("quickLinks")}</span><i /></div>
          <div className="site-nav__mobile-utilities">
            {mobileLinks.map(({ to, label, icon: Icon, count }) => (
              <Link to={to} onClick={close} key={to} className="site-nav__mobile-utility">
                <span><Icon size={17} /></span>
                <b>{label}</b>
                {count > 0 && <em>{count > 99 ? "99+" : count}</em>}
              </Link>
            ))}
          </div>

          <div className="site-nav__mobile-footer">
            {user && <button type="button" onClick={signOut} className="site-nav__mobile-logout"><LogOut size={16} />{t("logout")}</button>}
            <div className="site-nav__mobile-language"><span>{t("language")}</span><LanguageSwitcher /></div>
          </div>
        </div>
      )}
    </header>
  );
}

