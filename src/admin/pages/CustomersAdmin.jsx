import React, { useEffect, useState } from "react";
import * as adminService from "../../services/adminService.js";
import { useTranslation } from "react-i18next";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

const CustomersAdmin = () => {
  const { t } = useTranslation("admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const load = () => {
    setLoading(true);
    adminService.getAllUsers({ role: "customer" }).then((res) => setUsers(res.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleStatus = async (u) => {
    try {
      await adminService.updateUserStatus(u._id, !u.isActive);
      showToast(u.isActive ? t("customers.toastDeactivated") : t("customers.toastActivated"), "success");
      load();
    } catch (err) {
      showToast(t("customers.toastUpdateFailed"), "error");
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">{t("customers.title")}</h1>
      {users.length === 0 ? <EmptyState title={t("customers.empty")} /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("customers.name")}</th>
                <th className="px-4 py-3 font-semibold">{t("customers.email")}</th>
                <th className="px-4 py-3 font-semibold">{t("customers.phone")}</th>
                <th className="px-4 py-3 font-semibold">{t("customers.joined")}</th>
                <th className="px-4 py-3 font-semibold">{t("customers.status")}</th>
                <th className="px-4 py-3 text-right font-semibold">{t("customers.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.phone || "—"}</td>
                  <td className="px-4 py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{u.isActive ? <span className="text-emerald-600">{t("customers.active")}</span> : <span className="text-red-500">{t("customers.deactivated")}</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggleStatus(u)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium hover:bg-gray-50">
                      {u.isActive ? t("customers.deactivate") : t("customers.activate")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default CustomersAdmin;
