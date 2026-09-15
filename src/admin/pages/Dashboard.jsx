import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, ShoppingBag, Wrench, Users, Package, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as adminService from "../../services/adminService.js";
import Loader from "../../components/common/Loader.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";

const COLORS = ["#f97316", "#f59e0b", "#0b0f19", "#fb923c", "#fdba74", "#ea580c", "#d97706", "#c2410c"];

const StatCard = ({ icon: Icon, label, value, tint }) => (
  <div className="card flex items-center gap-4 p-5">
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tint}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="font-display text-xl font-bold text-ink-900">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { t } = useTranslation("admin");
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [brands, setBrands] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getDashboardStats(),
      adminService.getMonthlySales(),
      adminService.getPopularBrands(),
      adminService.getPopularRepairs(),
    ])
      .then(([s, sale, b, r]) => {
        setStats(s.data);
        setSales(sale.data.map((m) => ({ month: m._id, revenue: m.revenue, orders: m.orders })));
        setBrands(b.data);
        setRepairs(r.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">{t("dashboard.title")}</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard icon={DollarSign} label={t("dashboard.totalRevenue")} value={formatPrice(stats?.totalRevenue)} tint="bg-primary-600" />
        <StatCard icon={ShoppingBag} label={t("dashboard.totalOrders")} value={stats?.totalOrders ?? 0} tint="bg-ink-900" />
        <StatCard icon={Wrench} label={t("dashboard.repairBookings")} value={stats?.totalBookings ?? 0} tint="bg-gold-500" />
        <StatCard icon={Users} label={t("dashboard.customers")} value={stats?.totalCustomers ?? 0} tint="bg-emerald-600" />
        <StatCard icon={Package} label={t("dashboard.products")} value={stats?.totalProducts ?? 0} tint="bg-indigo-600" />
        <StatCard icon={AlertCircle} label={t("dashboard.pendingRepairs")} value={stats?.pendingRepairs ?? 0} tint="bg-red-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h3 className="mb-4 font-display font-semibold">{t("dashboard.monthlySales")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 font-display font-semibold">{t("dashboard.popularBrands")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={brands} dataKey="count" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {brands.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5 lg:col-span-3">
          <h3 className="mb-4 font-display font-semibold">{t("dashboard.mostRequestedRepairs")}</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={repairs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
