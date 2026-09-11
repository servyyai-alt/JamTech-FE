import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../services/api.js";
import { crud } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";
import { formatPrice } from "../../components/common/PriceTag.jsx";

const emptyForm = {
  title: "", category: "", brand: "", images: "", shortDescription: "", description: "",
  regularPrice: "", salePrice: "", stock: "", warranty: "", deliveryEstimate: "",
  isFeatured: false, isBestSeller: false, isActive: true,
};

const ProductsAdmin = () => {
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
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditing(null); setModalOpen(true); };
  const openEdit = (p) => {
    setForm({
      ...emptyForm, ...p,
      images: (p.images || []).join(", "),
      category: p.category?._id || p.category || "",
    });
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, images: form.images.split(",").map((s) => s.trim()).filter(Boolean) };
      if (editing) {
        await crud.update("products", editing._id, payload);
        showToast("Product updated", "success");
      } else {
        await crud.create("products", payload);
        showToast("Product created", "success");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await crud.remove("products", id);
    showToast("Product deleted", "success");
    load();
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900">Products</h1>
        <button onClick={openCreate} className="btn-primary !px-4 !py-2.5 text-sm"><Plus size={16} /> Add Product</button>
      </div>

      {products.length === 0 ? <EmptyState title="No products yet" /> : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
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
                  <td className="px-4 py-3">{formatPrice(p.salePrice || p.regularPrice)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.isActive ? <span className="text-emerald-600">Active</span> : <span className="text-gray-400">Inactive</span>}</td>
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
              <h3 className="font-display text-lg font-bold">{editing ? "Edit" : "Add"} Product</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><label className="label">Title *</label><input required className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label className="label">Brand</label><input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></div>
              <div>
                <label className="label">Category *</label>
                <select required className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2"><label className="label">Image URLs (comma separated)</label><input className="input" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">Short Description</label><input className="input" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="label">Description</label><textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className="label">Regular Price *</label><input required type="number" className="input" value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: Number(e.target.value) })} /></div>
              <div><label className="label">Sale Price</label><input type="number" className="input" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: Number(e.target.value) })} /></div>
              <div><label className="label">Stock</label><input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
              <div><label className="label">Warranty</label><input className="input" value={form.warranty} onChange={(e) => setForm({ ...form, warranty: e.target.value })} /></div>
              <div className="sm:col-span-2 flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} /> Best Seller</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary !px-4 !py-2 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-60">{saving ? "Saving..." : "Save Product"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
