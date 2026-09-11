import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { crud } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

/**
 * Generic CRUD admin page.
 * fields: [{ name, label, type: 'text'|'number'|'textarea'|'checkbox'|'select', options?: [{value,label}], required? }]
 * columns: [{ key, label, render?: (row) => node }]
 */
const GenericCrudPage = ({ title, resource, fields, columns, description }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectOptions, setSelectOptions] = useState({});
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await crud.list(resource);
      setItems(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); // eslint-disable-next-line
  }, [resource]);

  useEffect(() => {
    let cancelled = false;
    const fieldsWithRemoteOptions = fields.filter((field) => field.optionsResource);
    if (!fieldsWithRemoteOptions.length) {
      setSelectOptions({});
      return undefined;
    }

    Promise.all(fieldsWithRemoteOptions.map(async (field) => {
      const response = await crud.list(field.optionsResource);
      const records = response.data || [];
      return [field.name, records.map((record) => ({
        value: record._id,
        label: field.optionLabel ? field.optionLabel(record) : record.name,
      }))];
    }))
      .then((entries) => {
        if (!cancelled) setSelectOptions(Object.fromEntries(entries));
      })
      .catch(() => {
        if (!cancelled) showToast("Failed to load dropdown options", "error");
      });

    return () => { cancelled = true; };
    // Field configuration is static for a mounted CRUD page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const openCreate = () => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = f.type === "checkbox" ? true : ""));
    setForm(initial);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    const initial = {};
    fields.forEach((f) => {
      const value = item[f.name];
      // API list endpoints may populate a relation; select controls need its ID.
      initial[f.name] = value?._id ?? value ?? (f.type === "checkbox" ? true : "");
    });
    setForm(initial);
    setEditing(item);
    setModalOpen(true);
  };

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await crud.update(resource, editing._id, form);
        showToast("Updated successfully", "success");
      } else {
        await crud.create(resource, form);
        showToast("Created successfully", "success");
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
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await crud.remove(resource, id);
      showToast("Deleted", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <button onClick={openCreate} className="btn-primary !px-4 !py-2.5 text-sm">
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${title.toLowerCase()} yet`} description="Add your first item to get started." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3">{c.render ? c.render(row) : String(row[c.key] ?? "—")}</td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(row)} className="mr-2 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-primary-600">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(row._id)} className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-premium">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{editing ? "Edit" : "Add"} {title.replace(/s$/, "")}</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  {f.type !== "checkbox" && <label className="label">{f.label}{f.required && " *"}</label>}
                  {f.type === "textarea" ? (
                    <textarea rows={3} className="input" required={f.required} value={form[f.name] || ""} onChange={(e) => handleChange(f.name, e.target.value)} />
                  ) : f.type === "select" ? (
                    <select className="input" required={f.required} value={form[f.name] || ""} onChange={(e) => handleChange(f.name, e.target.value)}>
                      <option value="">Select...</option>
                      {(f.options || selectOptions[f.name] || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                      <input type="checkbox" checked={!!form[f.name]} onChange={(e) => handleChange(f.name, e.target.checked)} />
                      {f.label}
                    </label>
                  ) : (
                    <input type={f.type || "text"} className="input" required={f.required} value={form[f.name] || ""} onChange={(e) => handleChange(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)} />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary !px-4 !py-2 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-60">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericCrudPage;
