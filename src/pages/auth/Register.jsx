import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../../assets/register_bg.jpg";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation("auth");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({ name: data.name, email: data.email.trim(), phone: data.phone, password: data.password });
      showToast(t("register.success"), "success");
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.message || t("register.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-70px)] bg-white overflow-y-auto lg:overflow-hidden">
      {/* Left side: Image */}
      <div className="w-full lg:w-1/2 h-[220px] lg:h-auto shrink-0 relative">
        <img
          src={bgImage}
          alt="JAM Smart Tech Repair"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right side: Register Form */}
      <div className="flex w-full flex-col justify-center px-6 py-8 lg:w-1/2 lg:px-12 lg:py-12 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-1 text-center font-display text-2xl font-bold animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '100ms' }}>{t("register.title")}</h1>
          <p className="mb-4 text-center text-xs text-gray-500 animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '200ms' }}>{t("register.subtitle")}</p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Full Name */}
            <div className="animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '300ms' }}>
              <label className="label text-sm">{t("register.fullName")}</label>
              <input
                type="text"
                className="input py-1.5 text-sm"
                onInput={(e) => { e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s'-]/g, ''); }}
                {...register("name", { 
                  required: "Full Name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" }
                })} 
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message || t("register.nameRequired")}</p>}
            </div>

            {/* Email */}
            <div className="animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '400ms' }}>
              <label className="label text-sm">{t("register.email")}</label>
              <input 
                type="email" 
                className="input py-1.5 text-sm" 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })} 
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message || t("register.emailRequired")}</p>}
            </div>

            {/* Phone */}
            <div className="animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '500ms' }}>
              <label className="label text-sm">{t("register.phone")}</label>
              <input 
                type="tel"
                className="input py-1.5 text-sm" 
                onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9\s\-()+]/g, ''); }}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+?[0-9\s\-()]{7,15}$/,
                    message: "Invalid phone number format"
                  }
                })} 
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Password */}
            <div className="relative animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '600ms' }}>
              <label className="label text-sm">{t("register.password")}</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="input py-1.5 text-sm pr-10" 
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Include uppercase, lowercase, number, and special character"
                    }
                  })} 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[10px] leading-tight text-red-500">{errors.password.message || t("register.minChars")}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '700ms' }}>
              <label className="label text-sm">{t("register.confirmPassword")}</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="input py-1.5 text-sm pr-10" 
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: (v) => v === watch("password") || t("register.passwordsMismatch") 
                  })} 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary mt-2 py-2 text-sm w-full disabled:opacity-60 animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '800ms' }}>
              {loading ? t("register.creating") : t("register.createAccount")}
            </button>
          </form>
          
          <p className="mt-4 text-center text-xs text-gray-500 animate-fade-up" style={{ animationFillMode: 'both', animationDelay: '900ms' }}>
            {t("register.hasAccount")}{" "}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              {t("register.logIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;





