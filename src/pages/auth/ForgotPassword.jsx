import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as authService from "../../services/authService.js";
import { useToast } from "../../context/ToastContext.jsx";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      showToast(err.response?.data?.message || "Could not process request.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto max-w-md">
      <h1 className="mb-2 text-center font-display text-2xl font-bold">Forgot Password</h1>
      <p className="mb-8 text-center text-sm text-gray-500">We'll send you a reset link by email.</p>
      {sent ? (
        <div className="card p-6 text-center text-sm text-emerald-700">Check your email for a password reset link.</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          <div><label className="label">Email</label><input type="email" className="input" {...register("email", { required: true })} />{errors.email && <p className="mt-1 text-xs text-red-500">Email is required</p>}</div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Sending..." : "Send Reset Link"}</button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-gray-500"><Link to="/login" className="font-semibold text-primary-600">Back to Login</Link></p>
    </div>
  );
};
export default ForgotPassword;
