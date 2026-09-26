import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";

const EMAIL_PATTERN = { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i };

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("auth");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email.trim(), data.password);
      showToast(t("login.welcomeBack"), "success");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || t("login.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1 className="auth-card__title">{t("login.title")}</h1>
        <p className="auth-card__subtitle">{t("login.subtitle")}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field" style={{ animationDelay: "80ms" }}>
            <label className="auth-label" htmlFor="login-email">
              {t("login.email")}
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              inputMode="email"
              placeholder="you@example.com"
              className="auth-input"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email", {
                required: t("login.emailRequired"),
                pattern: { ...EMAIL_PATTERN, message: t("login.emailInvalid") },
              })}
            />
            {errors.email && (
              <p className="auth-error" id="login-email-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          <div className="auth-field" style={{ animationDelay: "160ms" }}>
            <label className="auth-label" htmlFor="login-password">
              {t("login.password")}
            </label>
            <div className="auth-inputwrap">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                className="auth-input"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                {...register("password", { required: t("login.passwordRequired") })}
              />
              <button
                type="button"
                className="auth-reveal"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-controls="login-password"
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {errors.password && (
              <p className="auth-error" id="login-password-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.password.message}</span>
              </p>
            )}
          </div>

          <div className="auth-row" style={{ animationDelay: "240ms" }}>
            <Link to="/forgot-password" className="auth-link">
              {t("login.forgotPassword")}
            </Link>
          </div>

          <button type="submit" className="auth-submit" disabled={loading} style={{ animationDelay: "320ms" }}>
            {loading ? (
              <>
                <span className="auth-spinner" aria-hidden="true" />
                {t("login.loggingIn")}
              </>
            ) : (
              t("login.logIn")
            )}
          </button>
        </form>

        <p className="auth-foot">
          {t("login.noAccount")}{" "}
          <Link to="/register" className="auth-link">
            {t("login.register")}
          </Link>
        </p>

        <div className="auth-trust">
          <span className="auth-trust__item">
            <ShieldCheck size={14} aria-hidden="true" />
            {t("auth.trust.secure")}
          </span>
          <span className="auth-trust__item">
            <Wrench size={14} aria-hidden="true" />
            {t("auth.trust.experts")}
          </span>
          <span className="auth-trust__item">
            <Sparkles size={14} aria-hidden="true" />
            {t("auth.trust.warranty")}
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
