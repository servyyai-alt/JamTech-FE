import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

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
      const res = await authService.resetPassword(token, data.password);
      
      // Auto-login after successful reset
      if (res.token && res.data?.user) {
        localStorage.setItem("jam_token", res.token);
        // We use window.location to force a full reload and let AuthContext initialize properly
        showToast(t("resetPassword.success"), "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        showToast(t("resetPassword.success"), "success");
        navigate("/login");
      }
    } catch (err) {
      showToast(err.response?.data?.message || t("resetPassword.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="container-px section-y mx-auto max-w-md">
      <h1 className="mb-8 text-center font-display text-2xl font-bold">{t("resetPassword.title")}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div>
          <label className="label">{t("resetPassword.newPassword")}</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} className="input pr-10" {...register("password", { required: true, minLength: 8 })} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{t("resetPassword.minChars")}</p>}
        </div>
        <div>
          <label className="label">{t("resetPassword.confirmPassword")}</label>
          <div className="relative">
            <input type={showConfirmPassword ? "text" : "password"} className="input pr-10" {...register("confirmPassword", { validate: (v) => v === watch("password") || t("resetPassword.passwordsMismatch") })} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? t("resetPassword.resetting") : t("resetPassword.resetPassword")}</button>
      </form>
    </div>
  );
};
export default ResetPassword;
