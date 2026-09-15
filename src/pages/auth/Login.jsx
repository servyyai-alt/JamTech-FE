import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("auth");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      showToast(t("login.welcomeBack"), "success");
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      showToast(err.response?.data?.message || t("login.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto flex max-w-md flex-col">
      <h1 className="mb-2 text-center font-display text-2xl font-bold">{t("login.title")}</h1>
      <p className="mb-8 text-center text-sm text-gray-500">{t("login.subtitle")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div><label className="label">{t("login.email")}</label><input type="email" className="input" {...register("email", { required: true })} />{errors.email && <p className="mt-1 text-xs text-red-500">{t("login.emailRequired")}</p>}</div>
        <div><label className="label">{t("login.password")}</label><input type="password" className="input" {...register("password", { required: true })} />{errors.password && <p className="mt-1 text-xs text-red-500">{t("login.passwordRequired")}</p>}</div>
        <div className="text-right"><Link to="/forgot-password" className="text-xs font-medium text-primary-600">{t("login.forgotPassword")}</Link></div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? t("login.loggingIn") : t("login.logIn")}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">{t("login.noAccount")} <Link to="/register" className="font-semibold text-primary-600">{t("login.register")}</Link></p>
    </div>
  );
};
export default Login;
