import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../../services/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";

const SettingsAdmin = () => {
  const { t } = useTranslation("admin");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    api.get("/settings").then((res) => setSettings(res.data.data)).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/settings", settings);
      setSettings(res.data.data);
      showToast(t("settings.toastSaved"), "success");
    } catch (err) {
      showToast(t("settings.toastSaveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <Loader full />;

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">{t("settings.title")}</h1>
      <form onSubmit={handleSave} className="card space-y-4 p-6">
        <div><label className="label">{t("settings.siteName")}</label><input className="input" value={settings.siteName || ""} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></div>
        <div><label className="label">{t("settings.tagline")}</label><input className="input" value={settings.tagline || ""} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} /></div>
        <div><label className="label">{t("settings.contactEmail")}</label><input className="input" value={settings.contactEmail || ""} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} /></div>
        <div><label className="label">{t("settings.contactPhone")}</label><input className="input" value={settings.contactPhone || ""} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">{t("settings.taxRate")}</label><input type="number" className="input" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })} /></div>
          <div><label className="label">{t("settings.freeShippingThreshold")}</label><input type="number" className="input" value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })} /></div>
        </div>
        <div><label className="label">{t("settings.standardShippingCost")}</label><input type="number" className="input" value={settings.standardShippingCost} onChange={(e) => setSettings({ ...settings, standardShippingCost: Number(e.target.value) })} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} /> {t("settings.maintenanceMode")}</label>
        <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60">{saving ? t("crud.saving") : t("settings.save")}</button>
      </form>
    </div>
  );
};
export default SettingsAdmin;
