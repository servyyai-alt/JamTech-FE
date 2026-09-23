import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../services/api.js";
import { crud } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";

const CURRENCIES = [
  { code: "EUR", label: "EUR (€)" },
  { code: "USD", label: "USD ($)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "INR", label: "INR (₹)" },
  { code: "PKR", label: "PKR (₨)" },
  { code: "AED", label: "AED (د.إ)" },
  { code: "SAR", label: "SAR (﷼)" },
  { code: "CAD", label: "CAD (CA$)" },
  { code: "AUD", label: "AUD (A$)" },
];

const emptyForm = {
  title: "", category: "", brand: "", images: [], shortDescription: "", description: "",
  regularPrice: "", salePrice: "", stock: "", currency: "EUR", warranty: "", deliveryEstimate: "",
  isFeatured: false, isBestSeller: false, isActive: true,
  frTitle: "", frShortDescription: "", frDescription: "", frWarranty: "",
};

const ProductsAdmin = () => {
  const { t } = useTranslation("admin");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.get("/products", { params: { limit: 100 } }), api.get("/categories")]);
      setProducts(pRes.data.data);
      setCategories(cRes.data.data);
    } catch (err) {
      showToast(t("products.toastLoadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setModalOpen(true); };
  const openEdit = (p) => {
    setForm({
      ...emptyForm, ...p,
      images: p.images || [],
      category: p.category?._id || p.category || "",
      frTitle: p.translations?.fr?.title || "",
      frShortDescription: p.translations?.fr?.shortDescription || "",
      frDescription: p.translations?.fr?.description || "",
      frWarranty: p.translations?.fr?.warranty || "",
    });
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { frTitle, frShortDescription, frDescription, frWarranty, ...rest } = form;
      const payload = {
        ...rest,
        images: form.images,
        translations: {
          fr: {
            title: frTitle,
            shortDescription: frShortDescription,
            description: frDescription,
            warranty: frWarranty,
          },
        },
      };
      if (editing) {
        await crud.update("products", editing._id, payload);
        showToast(t("products.toastUpdated"), "success");
      } else {
        await crud.create("products", payload);
        showToast(t("products.toastCreated"), "success");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t("products.toastSaveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleImagePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setForm((prev) => ({ ...prev, images: [...prev.images, event.target.result] }));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm((prev) => ({ ...prev, images: [...prev.images, event.target.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("products.confirmDelete"))) return;
    await crud.remove("products", id);
    showToast(t("products.toastDeleted"), "success");
    load();
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">{t("products.title")}</h1>
        <button onClick={openCreate} className="btn-primary !px-4 !py-2.5 text-sm"><Plus size={16} /> {t("products.addProduct")}</button>
      </div>

      {products.length === 0 ? <EmptyState title={t("products.empty")} /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">{t("products.colProduct")}</th>
                <th className="px-4 py-3 font-semibold">{t("products.colCategory")}</th>
                <th className="px-4 py-3 font-semibold">{t("products.colPrice")}</th>
                <th className="px-4 py-3 font-semibold">{t("products.colStock")}</th>
                <th className="px-4 py-3 font-semibold">{t("products.colStatus")}</th>
                <th className="px-4 py-3 text-right font-semibold">{t("products.colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                    <span className="font-medium">{p.title}</span>
                  </td>
                  <td className="px-4 py-3">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3">{formatPrice(p.salePrice || p.regularPrice, p.currency)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.isActive ? <span className="text-emerald-600">{t("products.active")}</span> : <span className="text-gray-400">{t("products.inactive")}</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="mr-2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p._id)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-premium">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{t("products.modalTitle", { action: editing ? t("products.edit") : t("products.add") })}</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">{t("products.titleField")}</label><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="label">{t("products.brandField")}</label><input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div>
                <label className="label">{t("products.categoryField")}</label>
                <select required className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">{t("products.selectCategory")}</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">{t("products.imageUrls")} (Upload, Paste, or URL)</label>
                <div 
                  className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-colors focus-within:border-primary-500 hover:border-primary-400"
                  onPaste={handleImagePaste}
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="url" 
                      placeholder="Paste image URL and press Enter" 
                      className="input flex-1" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          e.preventDefault();
                          setForm({ ...form, images: [...form.images, e.target.value] });
                          e.target.value = '';
                        }
                      }}
                    />
                    <label className="btn-secondary !py-2.5 cursor-pointer text-sm whitespace-nowrap m-0">
                      Upload File
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 m-0">Or paste an image directly into this area (Ctrl+V)</p>
                  
                  {form.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg border border-gray-200 p-1 bg-white">
                          <img src={img} alt="" className="h-16 w-16 object-cover rounded-md" />
                          <button 
                            type="button"
                            onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:col-span-2"><label className="label">{t("products.shortDescriptionField")}</label><input className="input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("products.descriptionField")}</label><textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="label">{t("products.regularPriceField")}</label><input required type="number" className="input" value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: Number(e.target.value) })} /></div>
              <div><label className="label">{t("products.salePriceField")}</label><input type="number" className="input" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} /></div>
              <div>
                <label className="label">{t("products.currencyField")}</label>
                <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                </select>
              </div>
              <div><label className="label">{t("products.stockField")}</label><input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
              <div><label className="label">{t("products.warrantyField")}</label><input className="input" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} /></div>
              <p className="sm:col-span-2 pt-2 font-display text-xs font-bold uppercase tracking-wider text-gray-400">French Translation</p>
              <div className="sm:col-span-2"><label className="label">{t("products.titleFrField")}</label><input className="input" value={form.frTitle} onChange={(e) => setForm({ ...form, frTitle: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("products.shortDescriptionFrField")}</label><input className="input" value={form.frShortDescription} onChange={(e) => setForm({ ...form, frShortDescription: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">{t("products.descriptionFrField")}</label><textarea rows={3} className="input" value={form.frDescription} onChange={(e) => setForm({ ...form, frDescription: e.target.value })} /></div>
              <div><label className="label">{t("products.warrantyFrField")}</label><input className="input" value={form.frWarranty} onChange={(e) => setForm({ ...form, frWarranty: e.target.value })} /></div>
              <div className="sm:col-span-2 flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> {t("products.featured")}</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> {t("products.bestSeller")}</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> {t("products.activeField")}</label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary !px-4 !py-2 text-sm">{t("crud.cancel")}</button>
                <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-60">{saving ? t("crud.saving") : t("products.saveProduct")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
