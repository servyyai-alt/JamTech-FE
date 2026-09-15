import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";

const ProfileSecurity = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const { t } = useTranslation("profile");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      showToast(t("security.passwordChanged"), "success");
      reset();
    } catch (err) {
      showToast(err.response?.data?.message || t("security.changeFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card max-w-md space-y-4 p-6">
      <div><label className="label">{t("security.currentPassword")}</label><input type="password" className="input" {...register("currentPassword", { required: true })} /></div>
      <div><label className="label">{t("security.newPassword")}</label><input type="password" className="input" {...register("newPassword", { required: true, minLength: 8 })} />{errors.newPassword && <p className="mt-1 text-xs text-red-500">{t("security.minChars")}</p>}</div>
      <button type="submit" disabled={loading} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60">{loading ? t("security.updating") : t("security.changePassword")}</button>
    </form>
  );
};
export default ProfileSecurity;
