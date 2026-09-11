import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import * as authService from "../../services/authService.js";

const ProfileOverview = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateMe(form);
      setUser(res.data);
      showToast("Profile updated", "success");
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="card max-w-lg space-y-4 p-6">
      <div><label className="label">Email</label><input className="input" value={user?.email} disabled /></div>
      <div><label className="label">Full Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
      <button type="submit" disabled={saving} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60">{saving ? "Saving..." : "Save Changes"}</button>
    </form>
  );
};
export default ProfileOverview;
