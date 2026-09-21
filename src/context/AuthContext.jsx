import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jam_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("jam_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem("jam_token", res.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem("jam_token", res.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (e) {}
    localStorage.removeItem("jam_token");
    setUser(null);
    navigate("/login");
  };

  const refreshUser = async () => {
    const res = await authService.getMe();
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, refreshUser, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
