import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { t } = useTranslation("auth");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(data.email);
      if (res.resetToken) {
        showToast("Dev mode: Redirecting to reset password", "success");
        navigate(`/reset-password/${res.resetToken}`);
      } else {
        setSent(true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || t("forgotPassword.processFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto max-w-md">
      <h1 className="mb-2 text-center font-display text-2xl font-bold">{t("forgotPassword.title")}</h1>
      <p className="mb-8 text-center text-sm text-gray-500">{t("forgotPassword.subtitle")}</p>
      {sent ? (
        <div className="card p-6 text-center text-sm text-emerald-700">{t("forgotPassword.checkEmail")}</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          <div><label className="label">{t("forgotPassword.email")}</label><input type="email" className="input" {...register("email", { required: true })} />{errors.email && <p className="mt-1 text-xs text-red-500">{t("forgotPassword.emailRequired")}</p>}</div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? t("forgotPassword.sending") : t("forgotPassword.sendLink")}</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-gray-500"><Link to="/login" className="font-semibold text-primary-600">{t("forgotPassword.backToLogin")}</Link></p>
    </div>
  );
};
export default ForgotPassword;
