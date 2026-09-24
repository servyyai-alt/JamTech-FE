import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { crud } from "../../services/adminService.js";
import { useToast } from "../../context/ToastContext.jsx";
import Loader from "../../components/common/Loader.jsx";
import EmptyState from "../../components/common/EmptyState.jsx";

/**
 * Generic CRUD admin page.
 * fields: [{ name, label, type: 'text'|'number'|'textarea'|'checkbox'|'select'|'multiselect', options?: [{value,label}], optionsResource?, optionLabel?, required?, section?, placeholder? }]
 *   - `name` may be dotted (e.g. "translations.fr.name") for nested fields.
 *   - `section` groups consecutive fields under a heading.
 *   - `multiselect` renders a checkbox list (values stored as an array of ids).
 * columns: [{ key, label, render?: (row) => node }]
 */
const getPath = (obj, path) =>
  path.split(".").reduce((acc, p) => (acc && acc[p] !== undefined ? acc[p] : undefined), obj);

const unflatten = (obj) => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let target = result;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (!target[part] || typeof target[part] !== "object") target[part] = {};
      target = target[part];
    }
    target[parts[parts.length - 1]] = value;
  }
  return result;
};

const getSearchableText = (obj) => {
  if (obj === null || obj === undefined) return "";
  if (typeof obj !== "object") return String(obj).toLowerCase();
  return Object.values(obj).map(getSearchableText).join(" ");
};

const GenericCrudPage = ({ title, resource, fields, columns, description }) => {
  const { t } = useTranslation("admin");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectOptions, setSelectOptions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await crud.list(resource, { active: false });
      setItems(res.data || []);
    } catch (err) {
      showToast(err.response?.data?.message || t("crud.toastLoadFailed"), "error");
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
        if (!cancelled) showToast(t("crud.toastDropdownFailed"), "error");
      });

    return () => { cancelled = true; };
    // Field configuration is static for a mounted CRUD page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [modalOpen]);

  const openCreate = () => {
    const initial = {};
    fields.forEach((f) => (initial[f.name] = f.type === "multiselect" ? [] : f.type === "checkbox" ? true : ""));
    setForm(initial);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    const initial = {};
    fields.forEach((f) => {
      const value = getPath(item, f.name);
      if (Array.isArray(value)) {
        // API list endpoints may populate a relation; controls need their IDs.
        initial[f.name] = value.map((v) => (typeof v === "string" ? v : v?._id));
      } else {
        initial[f.name] = value?._id ?? value ?? (f.type === "checkbox" ? true : "");
      }
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
      const payload = unflatten(form);
      if (editing) {
        await crud.update(resource, editing._id, payload);
        showToast(t("crud.toastUpdated"), "success");
      } else {
        await crud.create(resource, payload);
        showToast(t("crud.toastCreated"), "success");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t("crud.toastSaveFailed"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("crud.confirmDelete"))) return;
    try {
      await crud.remove(resource, id);
      showToast(t("crud.toastDeleted"), "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.message || t("crud.toastDeleteFailed"), "error");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="search" 
            placeholder="Search..." 
            className="input !py-2 !w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={openCreate} className="btn-primary !px-4 !py-2.5 text-sm whitespace-nowrap">
            <Plus size={16} /> {t("crud.addNew")}
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <EmptyState title={t("crud.emptyTitle", { name: title.toLowerCase() })} description={t("crud.emptyDescription")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {columns.map((c) => <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>)}
                <th className="px-4 py-3 text-right font-semibold">{t("crud.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const searchLower = searchQuery.toLowerCase();
                const filtered = items.filter((row) => !searchQuery || getSearchableText(row).includes(searchLower));
                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-sm text-gray-500">
                        No results found
                      </td>
                    </tr>
                  );
                }
                return filtered.map((row) => (
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
                ));
              })()}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-premium">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">{editing ? t("crud.edit") : t("crud.add")} {title.replace(/s$/, "")}</h3>
              <button onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f, i) => {
                const value = form[f.name];
                const showSection = f.section && (i === 0 || fields[i - 1].section !== f.section);
                return (
                  <div key={f.name}>
                    {showSection && (
                      <p className={`pt-2 font-display text-xs font-bold uppercase tracking-wider text-gray-400 ${i > 0 ? "mt-4" : ""}`}>{f.section}</p>
                    )}
                    {f.type !== "checkbox" && <label className="label">{f.label}{f.required && " *"}</label>}
                    {f.type === "textarea" ? (
                      <textarea rows={3} className="input" placeholder={f.placeholder} required={f.required} value={value || ""} onChange={(e) => handleChange(f.name, e.target.value)} />
                    ) : f.type === "select" ? (
                      <select className="input" required={f.required} value={value || ""} onChange={(e) => handleChange(f.name, e.target.value)}>
                        <option value="">{t("crud.select")}...</option>
                        {(f.options || selectOptions[f.name] || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === "multiselect" ? (
                      <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3">
                        {(f.options || selectOptions[f.name] || []).length === 0 ? (
                          <p className="text-sm text-gray-400">{t("crud.noOptions")}</p>
                        ) : (f.options || selectOptions[f.name] || []).map((o) => (
                          <label key={o.value} className="flex items-center gap-2 py-1 text-sm text-ink-700">
                            <input
                              type="checkbox"
                              checked={(value || []).includes(o.value)}
                              onChange={(e) => {
                                const current = value || [];
                                const next = e.target.checked ? [...current, o.value] : current.filter((v) => v !== o.value);
                                handleChange(f.name, next);
                              }}
                            />
                            <span className="font-medium">{o.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : f.type === "checkbox" ? (
                      <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
                        <input type="checkbox" checked={!!value} onChange={(e) => handleChange(f.name, e.target.checked)} />
                        {f.label}
                      </label>
                    ) : f.type === "image" ? (
                      <div 
                        className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-colors focus-within:border-primary-500 hover:border-primary-400"
                        onPaste={(e) => {
                          const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
                          if (!items) return;
                          for (let index in items) {
                            if (items[index].kind === 'file') {
                              const blob = items[index].getAsFile();
                              const reader = new FileReader();
                              reader.onload = (event) => handleChange(f.name, event.target.result);
                              reader.readAsDataURL(blob);
                            }
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <label className="btn-secondary !py-2.5 cursor-pointer text-sm whitespace-nowrap m-0">
                            Upload File
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => handleChange(f.name, event.target.result);
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </label>
                        </div>
                        <p className="text-xs text-gray-400 m-0">Or paste an image directly into this area (Ctrl+V)</p>
                        {value && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="relative group rounded-lg border border-gray-200 p-1 bg-white">
                              <img src={value} alt="" className="h-16 w-16 object-cover rounded-md" />
                              <button 
                                type="button"
                                onClick={() => handleChange(f.name, "")}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input type={f.type || "text"} className="input" placeholder={f.placeholder} required={f.required} value={f.type === "date" && value ? String(value).split("T")[0] : (value || "")} onChange={(e) => handleChange(f.name, f.type === "number" ? Number(e.target.value) : e.target.value)} />
                    )}
                  </div>
                );
              })}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary !px-4 !py-2 text-sm">{t("crud.cancel")}</button>
                <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2 text-sm disabled:opacity-60">
                  {saving ? t("crud.saving") : t("crud.save")}
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
