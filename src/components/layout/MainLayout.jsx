import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const MainLayout = () => {
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
          className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-900 shadow-premium transition-transform hover:scale-110 border border-gray-100"
          title="Go Back"
        >
          <ArrowLeft size={20} />
        </button>
      )}
    </div>
  );
};

export default MainLayout;
