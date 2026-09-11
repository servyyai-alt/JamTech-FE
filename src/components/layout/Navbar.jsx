import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Wrench, Package, Menu, X, LogOut, Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useCart } from "../../context/CartContext.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/repair", label: "Repair Services" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
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
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 font-display text-lg font-extrabold text-white">
            J
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink-900">
            JAM <span className="text-primary-600">Smart Tech</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-ink-700 transition hover:text-primary-600">
              {l.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="relative hidden max-w-xs flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, repairs..."
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-400 focus:bg-white"
          />
        </form>

        <div className="flex items-center gap-1.5">
          <Link to="/track-repair" title="Track Repair" className="hidden rounded-full p-2 text-ink-700 hover:bg-gray-100 md:inline-flex">
            <Wrench size={20} />
          </Link>
          <Link to="/track-order" title="Track Order" className="hidden rounded-full p-2 text-ink-700 hover:bg-gray-100 md:inline-flex">
            <Package size={20} />
          </Link>
          <Link to="/profile/wishlist" title="Wishlist" aria-label="Wishlist" className="relative rounded-full p-2 text-ink-700 hover:bg-gray-100">
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
                <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">Profile</Link>
                <Link to="/profile/orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">Orders</Link>
                <Link to="/profile/repairs" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">Repair Bookings</Link>
                {user.role === "admin" && <Link to="/admin" className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-gray-50">Admin Dashboard</Link>}
                <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden rounded-full p-2 text-ink-700 hover:bg-gray-100 md:inline-flex">
              <User size={20} />
            </Link>
          )}

          <button className="rounded-full p-2 text-ink-700 hover:bg-gray-100 lg:hidden" onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="input pl-9" />
          </form>
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">
                {l.label}
              </Link>
            ))}
            <Link to="/track-repair" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">Track Repair</Link>
            <Link to="/track-order" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">Track Order</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">Profile</Link>
                {user.role === "admin" && <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-600 hover:bg-gray-50">Admin Dashboard</Link>}
                <button onClick={logout} className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-gray-50">Login / Register</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
