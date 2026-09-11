import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";

const ProfileSecurity = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      showToast("Password changed successfully", "success");
      reset();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card max-w-md space-y-4 p-6">
      <div><label className="label">Current Password</label><input type="password" className="input" {...register("currentPassword", { required: true })} /></div>
      <div><label className="label">New Password</label><input type="password" className="input" {...register("newPassword", { required: true, minLength: 8 })} />{errors.newPassword && <p className="mt-1 text-xs text-red-500">Minimum 8 characters</p>}</div>
      <button type="submit" disabled={loading} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60">{loading ? "Updating..." : "Change Password"}</button>
    </form>
  );
};
export default ProfileSecurity;
