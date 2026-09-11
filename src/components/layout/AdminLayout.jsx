import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, Smartphone, Tag, Layers, SlidersHorizontal, Wrench,
  ClipboardList, ShoppingBag, FolderTree, Package, Users, Ticket, Star, CreditCard, Settings,
} from "lucide-react";

const groups = [
  {
    title: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    title: "Repair Module",
    items: [
      { to: "/admin/device-categories", label: "Device Categories", icon: Smartphone },
      { to: "/admin/brands", label: "Brands", icon: Tag },
      { to: "/admin/models", label: "Models", icon: Layers },
      { to: "/admin/variants", label: "Variants / Config", icon: SlidersHorizontal },
      { to: "/admin/repair-services", label: "Repair Services", icon: Wrench },
      { to: "/admin/bookings", label: "Repair Bookings", icon: ClipboardList },
    ],
  },
  {
    title: "E-Commerce",
    items: [
      { to: "/admin/products", label: "Products", icon: ShoppingBag },
      { to: "/admin/categories", label: "Categories", icon: FolderTree },
      { to: "/admin/orders", label: "Orders", icon: Package },
      { to: "/admin/coupons", label: "Coupons", icon: Ticket },
      { to: "/admin/reviews", label: "Reviews", icon: Star },
    ],
  },
  {
    title: "General",
    items: [
      { to: "/admin/customers", label: "Customers", icon: Users },
      { to: "/admin/payments", label: "Payments", icon: CreditCard },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const AdminLayout = () => (
  <div className="flex min-h-screen bg-gray-50">
    <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-gray-100 bg-ink-900 text-gray-300 lg:block">
      <Link to="/" className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-gold-500 font-display text-sm font-extrabold text-white">J</div>
        <span className="font-display font-bold text-white">JAM Admin</span>
      </Link>
      <nav className="space-y-6 px-3 pb-10">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{g.title}</p>
            <div className="space-y-0.5">
              {g.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive ? "bg-primary-600 text-white" : "hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
    <div className="flex-1 overflow-x-hidden">
      <div className="container-px py-8">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
