import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      showToast(t("register.success"), "success");
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.message || t("register.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto flex max-w-md flex-col">
      <h1 className="mb-2 text-center font-display text-2xl font-bold">{t("register.title")}</h1>
      <p className="mb-8 text-center text-sm text-gray-500">{t("register.subtitle")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div><label className="label">{t("register.fullName")}</label><input className="input" {...register("name", { required: true })} />{errors.name && <p className="mt-1 text-xs text-red-500">{t("register.nameRequired")}</p>}</div>
        <div><label className="label">{t("register.email")}</label><input type="email" className="input" {...register("email", { required: true })} />{errors.email && <p className="mt-1 text-xs text-red-500">{t("register.emailRequired")}</p>}</div>
        <div><label className="label">{t("register.phone")}</label><input className="input" {...register("phone")} /></div>
        <div><label className="label">{t("register.password")}</label><input type="password" className="input" {...register("password", { required: true, minLength: 8 })} />{errors.password && <p className="mt-1 text-xs text-red-500">{t("register.minChars")}</p>}</div>
        <div><label className="label">{t("register.confirmPassword")}</label><input type="password" className="input" {...register("confirmPassword", { validate: (v) => v === watch("password") || t("register.passwordsMismatch") })} />{errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}</div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? t("register.creating") : t("register.createAccount")}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">{t("register.hasAccount")} <Link to="/login" className="font-semibold text-primary-600">{t("register.logIn")}</Link></p>
    </div>
  );
};
export default Register;
