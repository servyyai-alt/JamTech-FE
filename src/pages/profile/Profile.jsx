import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { User, MapPin, Package, Wrench, Heart, Lock } from "lucide-react";

const tabs = [
  { to: "/profile", label: "Profile", icon: User, end: true },
  { to: "/profile/addresses", label: "Addresses", icon: MapPin },
  { to: "/profile/orders", label: "Orders", icon: Package },
  { to: "/profile/repairs", label: "Repair Bookings", icon: Wrench },
  { to: "/profile/wishlist", label: "Wishlist", icon: Heart },
  { to: "/profile/security", label: "Change Password", icon: Lock },
];

const Profile = () => (
  <div className="container-px section-y mx-auto max-w-6xl">
    <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">My Account</h1>
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${isActive ? "bg-ink-900 text-white" : "hover:bg-gray-100"}`}
          >
            <t.icon size={16} /> {t.label}
          </NavLink>
        ))}
      </nav>
      <div><Outlet /></div>
    </div>
  </div>
);
export default Profile;
