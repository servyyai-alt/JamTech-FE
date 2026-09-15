import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../common/Loader.jsx";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation("auth");

  if (loading) return <Loader full label={t("protectedRoute.checkingSession")} />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
