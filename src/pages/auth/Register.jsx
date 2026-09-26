import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, Eye, EyeOff, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import AuthLayout from "../../components/auth/AuthLayout.jsx";

const EMAIL_PATTERN = { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i };
const PHONE_PATTERN = { value: /^\+?[0-9\s\-()]{7,15}$/ };
// Kept identical to the server rule so the meter and the error agree.
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Meeting the bare 8-char minimum is "fair", not "strong": score climbs with
// length as well as character-class variety so the label stays honest.
const CLASS_TESTS = [/[a-z]/, /[A-Z]/, /\d/, /[@$!%*?&]/];

const scorePassword = (value) => {
  if (!value) return 0;
  const classes = CLASS_TESTS.filter((re) => re.test(value)).length;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (classes === 4) score += 1;
  if (value.length >= 10) score += 1;
  if (value.length >= 12 && classes === 4) score += 1;
  return Math.min(score, 4);
};

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation("auth");

  const passwordValue = watch("password") || "";
  const score = useMemo(() => scorePassword(passwordValue), [passwordValue]);
  const meterClass = ["", "weak", "fair", "good", "strong"][score];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({ name: data.name, email: data.email.trim(), phone: data.phone, password: data.password });
      showToast(t("register.success"), "success");
      navigate("/", { replace: true });
    } catch (err) {
      showToast(err.response?.data?.message || t("register.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card">
        <h1 className="auth-card__title">{t("register.title")}</h1>
        <p className="auth-card__subtitle">{t("register.subtitle")}</p>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field" style={{ animationDelay: "60ms" }}>
            <label className="auth-label" htmlFor="register-name">
              {t("register.fullName")}
            </label>
            <input
              id="register-name"
              type="text"
              name="name"
              autoComplete="name"
              className="auth-input"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              {...register("name", {
                required: t("register.nameRequired"),
                minLength: { value: 3, message: t("register.nameTooShort") },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, "");
              }}
            />
            {errors.name && (
              <p className="auth-error" id="register-name-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.name.message}</span>
              </p>
            )}
          </div>

          <div className="auth-field" style={{ animationDelay: "120ms" }}>
            <label className="auth-label" htmlFor="register-email">
              {t("register.email")}
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              inputMode="email"
              placeholder="you@example.com"
              className="auth-input"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "register-email-error" : undefined}
              {...register("email", {
                required: t("register.emailRequired"),
                pattern: { ...EMAIL_PATTERN, message: t("register.emailInvalid") },
              })}
            />
            {errors.email && (
              <p className="auth-error" id="register-email-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.email.message}</span>
              </p>
            )}
          </div>

          <div className="auth-field" style={{ animationDelay: "180ms" }}>
            <label className="auth-label" htmlFor="register-phone">
              {t("register.phone")}
            </label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+33 6 12 34 56 78"
              className="auth-input"
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "register-phone-error" : undefined}
              {...register("phone", {
                required: t("register.phoneRequired"),
                pattern: { ...PHONE_PATTERN, message: t("register.phoneInvalid") },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9\s\-()+]/g, "");
              }}
            />
            {errors.phone && (
              <p className="auth-error" id="register-phone-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.phone.message}</span>
              </p>
            )}
          </div>

          <div className="auth-field" style={{ animationDelay: "240ms" }}>
            <label className="auth-label" htmlFor="register-password">
              {t("register.password")}
            </label>
            <div className="auth-inputwrap">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                className="auth-input"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "register-password-error" : "register-password-hint"}
                {...register("password", {
                  required: t("register.passwordRequired"),
                  minLength: { value: 8, message: t("register.minChars") },
                  pattern: { value: PASSWORD_RULE, message: t("register.passwordWeak") },
                })}
              />
              <button
                type="button"
                className="auth-reveal"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-controls="register-password"
                aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>

            {passwordValue ? (
              <div className="auth-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((step) => (
                  <span
                    key={step}
                    className={`auth-meter__bar ${step <= score ? `auth-meter__bar--on-${meterClass}` : ""}`}
                  />
                ))}
              </div>
            ) : null}
            {passwordValue && score > 0 ? (
              <p className="auth-meter__label">{t(`register.strength.${meterClass}`)}</p>
            ) : null}

            {errors.password ? (
              <p className="auth-error" id="register-password-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.password.message}</span>
              </p>
            ) : (
              <p className="auth-hint" id="register-password-hint">
                {t("register.passwordHint")}
              </p>
            )}
          </div>

          <div className="auth-field" style={{ animationDelay: "300ms" }}>
            <label className="auth-label" htmlFor="register-confirm">
              {t("register.confirmPassword")}
            </label>
            <div className="auth-inputwrap">
              <input
                id="register-confirm"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                autoComplete="new-password"
                className="auth-input"
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={errors.confirmPassword ? "register-confirm-error" : undefined}
                {...register("confirmPassword", {
                  required: t("register.confirmRequired"),
                  validate: (v) => v === watch("password") || t("register.passwordsMismatch"),
                })}
              />
              <button
                type="button"
                className="auth-reveal"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-pressed={showConfirmPassword}
                aria-controls="register-confirm"
                aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
              >
                {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="auth-error" id="register-confirm-error" role="alert">
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errors.confirmPassword.message}</span>
              </p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={loading} style={{ animationDelay: "360ms" }}>
            {loading ? (
              <>
                <span className="auth-spinner" aria-hidden="true" />
                {t("register.creating")}
              </>
            ) : (
              t("register.createAccount")
            )}
          </button>
        </form>

        <p className="auth-foot">
          {t("register.hasAccount")}{" "}
          <Link to="/login" className="auth-link">
            {t("register.logIn")}
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

export default Register;
