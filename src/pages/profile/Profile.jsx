import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { User, MapPin, Package, Wrench, Heart, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation("profile");
  const tabs = [
    { to: "/profile", label: t("tabs.profile"), icon: User, end: true },
    { to: "/profile/addresses", label: t("tabs.addresses"), icon: MapPin },
    { to: "/profile/orders", label: t("tabs.orders"), icon: Package },
    { to: "/profile/repairs", label: t("tabs.repairs"), icon: Wrench },
    { to: "/profile/wishlist", label: t("tabs.wishlist"), icon: Heart },
    { to: "/profile/security", label: t("tabs.security"), icon: Lock },
  ];
  return (
    <div className="container-px section-y mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900">{t("heading")}</h1>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${isActive ? "bg-ink-900 text-white" : "hover:bg-gray-100"}`}
            >
              <tab.icon size={16} /> {tab.label}
            </NavLink>
          ))}
        </nav>
        <div><Outlet /></div>
      </div>
    </div>
  );
};
export default Profile;
