import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      showToast("Password reset successfully. Please log in.", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || "Reset failed. The link may have expired.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto max-w-md">
      <h1 className="mb-8 text-center font-display text-2xl font-bold">Reset Your Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div><label className="label">New Password</label><input type="password" className="input" {...register("password", { required: true, minLength: 8 })} />{errors.password && <p className="mt-1 text-xs text-red-500">Minimum 8 characters</p>}</div>
        <div><label className="label">Confirm Password</label><input type="password" className="input" {...register("confirmPassword", { validate: (v) => v === watch("password") || "Passwords do not match" })} />{errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}</div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Resetting..." : "Reset Password"}</button>
      </form>
    </div>
  );
};
export default ResetPassword;
