import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const MainLayout = () => {
  const { t } = useTranslation("nav");
  const location = useLocation();
  const navigate = useNavigate();
  const hideFooter = ["/login", "/register", "/forgot-password"].some(path => location.pathname.startsWith(path));
  const showBackButton = location.pathname !== "/";

  const handleBack = () => {
    navigate(-1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      
      {showBackButton && (
        <button
          onClick={handleBack}
          className="fixed top-24 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-900 shadow-premium transition-transform hover:scale-110 border border-gray-100"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <Link to="/repair/manual-quote" className="floating-repair-cta" aria-label={t("floatingRepair")}>
        <span className="floating-repair-cta__icon"><Wrench size={16} aria-hidden="true" /></span>
        <span>{t("floatingRepair")}</span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
};

export default MainLayout;
