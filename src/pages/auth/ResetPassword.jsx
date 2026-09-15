import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      showToast(t("resetPassword.success"), "success");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || t("resetPassword.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto max-w-md">
      <h1 className="mb-8 text-center font-display text-2xl font-bold">{t("resetPassword.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div><label className="label">{t("resetPassword.newPassword")}</label><input type="password" className="input" {...register("password", { required: true, minLength: 8 })} />{errors.password && <p className="mt-1 text-xs text-red-500">{t("resetPassword.minChars")}</p>}</div>
        <div><label className="label">{t("resetPassword.confirmPassword")}</label><input type="password" className="input" {...register("confirmPassword", { validate: (v) => v === watch("password") || t("resetPassword.passwordsMismatch") })} />{errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}</div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? t("resetPassword.resetting") : t("resetPassword.resetPassword")}</button>
      </form>
    </div>
  );
};
export default ResetPassword;
