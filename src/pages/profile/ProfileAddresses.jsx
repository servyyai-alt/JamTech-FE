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

  return (
    <div>
      <div className="mb-4 flex justify-end"><button onClick={openCreate} className="btn-primary !px-4 !py-2 text-sm"><Plus size={15} /> {t("addresses.addAddress")}</button></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(user?.addresses || []).map((a) => (
          <div key={a._id} className="card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-primary-600">{a.label}{a.isDefault && ` · ${t("addresses.default")}`}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="rounded p-1 hover:bg-gray-100"><Pencil size={14} /></button>
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
              <input className="input" placeholder={t("addresses.modal.label")} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
              <input required className="input" placeholder={t("addresses.modal.fullName")} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input required className="input" placeholder={t("addresses.modal.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input required className="input" placeholder={t("addresses.modal.addressLine1")} value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
              <input className="input" placeholder={t("addresses.modal.addressLine2")} value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input required className="input" placeholder={t("addresses.modal.city")} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <input required className="input" placeholder={t("addresses.modal.postalCode")} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
              </div>
              <input required className="input" placeholder={t("addresses.modal.country")} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
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
