import React, { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as authService from "../../services/authService.js";
import { useTranslation } from "react-i18next";

const empty = { label: "Home", fullName: "", phone: "", addressLine1: "", addressLine2: "", city: "", postalCode: "", country: "", isDefault: false };

const ProfileAddresses = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation("profile");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openCreate = () => { setForm(empty); setEditing(null); setModalOpen(true); };
  const openEdit = (a) => { setForm(a); setEditing(a); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await authService.updateAddress(editing._id, form);
      else await authService.addAddress(form);
      await refreshUser();
      showToast(t("addresses.addressSaved"), "success");
      setModalOpen(false);
    } catch {
      showToast(t("addresses.saveFailed"), "error");
    }
  };

  const handleDelete = async (id) => {
    await authService.deleteAddress(id);
    await refreshUser();
    showToast(t("addresses.addressRemoved"), "success");
  };

  const handleInput = (field, regexPattern) => (e) => {
    let val = e.target.value;
    if (regexPattern) val = val.replace(regexPattern, "");
    setForm({ ...form, [field]: val });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">{t("addresses.title")}</h2>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 !py-2 !px-4 text-sm"><Plus size={16} />{t("addresses.addNew")}</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {user?.addresses?.map((a) => (
          <div key={a._id} className="card relative p-5">
            {a.isDefault && <span className="absolute -top-3 -right-3 rounded-full bg-primary-100 px-3 py-1 text-xs font-bold text-primary-700">{t("addresses.default")}</span>}
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-gray-500">{a.label || "Address"}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="rounded p-1 hover:bg-gray-50"><Pencil size={14} className="text-gray-400" /></button>
                <button onClick={() => handleDelete(a._id)} className="rounded p-1 hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
              </div>
            </div>
            <p className="text-sm font-medium">{a.fullName}</p>
            <p className="text-sm text-gray-500">{a.addressLine1}, {a.city}, {a.postalCode}, {a.country}</p>
            <p className="text-sm text-gray-500">{a.phone}</p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4 flex justify-between"><h3 className="font-display font-bold">{editing ? t("addresses.modal.editTitle") : t("addresses.modal.addTitle")}</h3><button onClick={() => setModalOpen(false)}><X size={18} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.label")} value={form.label} onChange={handleInput("label", /[^A-Za-z0-9\s\-_]/g)} />
              <input required className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.fullName")} value={form.fullName} onChange={handleInput("fullName", /[^A-Za-z\s\-']/g)} />
              <input required className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.phone")} maxLength={10} minLength={10} value={form.phone} onChange={handleInput("phone", /[^\d\+\-\s\(\)]/g)} />
              <input required className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.addressLine1")} value={form.addressLine1} onChange={handleInput("addressLine1", null)} />
              <input className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.addressLine2")} value={form.addressLine2} onChange={handleInput("addressLine2", null)} />
              <div className="grid grid-cols-2 gap-2">
                <input required className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.city")} value={form.city} onChange={handleInput("city", /[^A-Za-z\s\-']/g)} />
                <input required className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.postalCode")} value={form.postalCode} onChange={handleInput("postalCode", /[^\d]/g)} />
              </div>
              <input required className="input focus:ring-primary-500 focus:border-primary-500" placeholder={t("addresses.modal.country")} value={form.country} onChange={handleInput("country", /[^A-Za-z\s\-']/g)} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> {t("addresses.modal.setDefault")}</label>
              <button className="btn-primary w-full">{t("addresses.modal.save")}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileAddresses;
