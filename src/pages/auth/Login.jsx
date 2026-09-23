import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Smartphone, Laptop, Tablet } from "lucide-react";
import phoneImg from "../../assets/device_phone.jpg";
import laptopImg from "../../assets/device_laptop.jpg";
import tabletImg from "../../assets/device_tablet.jpg";

const DeviceShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const devices = [
    {
      id: "phone",
      label: "PHONE REPAIR",
      icon: Smartphone,
      Component: (
        <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden">
          <img src={phoneImg} alt="Smartphone" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
      ),
    },
    {
      id: "laptop",
      label: "LAPTOP REPAIR",
      icon: Laptop,
      Component: (
        <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden">
          <img src={laptopImg} alt="Laptop" className="w-full h-full object-contain drop-shadow-2xl scale-110" />
        </div>
      ),
    },
    {
      id: "tablet",
      label: "TABLET REPAIR",
      icon: Tablet,
      Component: (
        <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden">
          <img src={tabletImg} alt="Tablet" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
      ),
    },
  ];

  return (
    <div className="relative flex w-full h-full flex-col items-center justify-center overflow-hidden bg-ink-900 py-8 lg:py-12">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary-600/20 blur-[80px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px]"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-primary-500 rounded-full animate-float" style={{ 
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 5}s` 
          }}></div>
        ))}
      </div>

      {/* Device Stage */}
      <div className="relative flex h-72 lg:h-80 w-full items-center justify-center z-10 perspective-1000">
        {devices.map((device, idx) => {
          const isActive = idx === activeIndex;
          const isPrev = idx === (activeIndex - 1 + devices.length) % devices.length;

          return (
            <div
              key={device.id}
              className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive
                  ? "z-20 scale-100 opacity-100 translate-y-0"
                  : isPrev
                  ? "z-10 scale-90 opacity-0 -translate-x-12"
                  : "z-10 scale-110 opacity-0 translate-x-12"
              }`}
            >
              <div className={isActive ? "animate-float motion-reduce:animate-none" : ""}>
                {device.Component}
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketing Text */}
      <div className="z-10 mt-6 lg:mt-8 flex flex-col items-center px-4 text-center">
        <h2 className="mb-2 font-display text-xl lg:text-3xl font-bold tracking-wide text-white animate-fade-up">
          WE FIX WHAT KEEPS YOU CONNECTED
        </h2>
        <p className="text-sm lg:text-base text-gray-400 animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
          Expert repair for phones, laptops & tablets.
        </p>

        {/* Service Indicators */}
        <div className="mt-6 lg:mt-8 flex gap-6 animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          {devices.map((dev, idx) => {
            const Icon = dev.icon;
            const isActive = idx === activeIndex;
            return (
              <div key={dev.id} className={`flex flex-col items-center gap-2 transition-colors duration-500 ${isActive ? "text-primary-500" : "text-gray-600"}`}>
                <div className={`rounded-full p-2.5 lg:p-3 transition-all duration-500 ${isActive ? "bg-primary-500/10 shadow-glow" : "bg-gray-800"}`}>
                  <Icon size={18} className="lg:w-5 lg:h-5" />
                </div>
                <span className="text-[9px] lg:text-[10px] font-semibold tracking-wider">{dev.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      showToast(err.response?.data?.message || t("login.failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col lg:flex-row bg-slate-50 overflow-y-auto lg:overflow-hidden">
      
      {/* Left side: Animated Showcase */}
      <div className="w-full lg:w-1/2 h-auto min-h-[480px] lg:min-h-0 lg:h-auto shrink-0 relative overflow-hidden">
        <DeviceShowcase />
      </div>

      {/* Right side: Login Form */}
      <div className="flex w-full flex-col justify-center items-center px-4 py-8 lg:w-1/2 lg:px-12 lg:py-16 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-[20px] shadow-premium border border-gray-100 p-8 lg:p-10 animate-fade-up">
          <h1 className="mb-2 text-center font-display text-2xl lg:text-3xl font-bold text-gray-900">
            {t("login.title") || "Welcome Back"}
          </h1>
          <p className="mb-8 text-center text-sm text-gray-500">
            {t("login.subtitle") || "Log in to manage your orders and repairs."}
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("login.email") || "Email"}</label>
              <input 
                type="email" 
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" 
                {...register("email", { required: true })} 
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{t("login.emailRequired")}</p>}
            </div>

            {/* Password */}
            <div className="animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("login.password") || "Password"}</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-10" 
                  {...register("password", { required: true })} 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{t("login.passwordRequired")}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end animate-fade-up" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
              <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                {t("login.forgotPassword") || "Forgot password?"}
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg py-3 hover:from-primary-700 hover:to-primary-600 transition-all shadow-md disabled:opacity-70 animate-fade-up"
              style={{ animationDelay: "400ms", animationFillMode: "both" }}
            >
              {loading ? (t("login.loggingIn") || "Logging in...") : (t("login.logIn") || "Log In")}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-sm text-gray-600 animate-fade-up" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
            {t("login.noAccount") || "Don't have an account?"}{" "}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              {t("login.register") || "Register"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;





