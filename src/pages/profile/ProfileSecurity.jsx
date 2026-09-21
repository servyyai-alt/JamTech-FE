import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useTranslation } from "react-i18next";

const ProfileSecurity = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation("profile");
  const [loading, setLoading] = useState(false);

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword({ newPassword: data.newPassword });
      showToast("Password changed successfully. Please log in again.", "success");
      logout();
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || t("security.changeFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card max-w-md space-y-4 p-6">
      <div>
        <label className="label">{t("security.newPassword")}</label>
        <input type="password" className="input focus:ring-primary-500 focus:border-primary-500" {...register("newPassword", { required: true, minLength: 8 })} />
        {errors.newPassword && <p className="mt-1 text-xs text-red-500">{t("security.minChars")}</p>}
      </div>
      <div>
        <label className="label">Confirm New Password</label>
        <input 
          type="password" 
          className="input focus:ring-primary-500 focus:border-primary-500" 
          {...register("confirmPassword", { 
            required: true, 
            validate: value => value === newPassword || "Passwords do not match" 
          })} 
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={loading} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60 w-full mt-2">
        {loading ? t("security.updating") : t("security.changePassword")}
      </button>
    </form>
  );
};
export default ProfileSecurity;
