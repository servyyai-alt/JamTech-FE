import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signUp({ name: data.name, email: data.email, phone: data.phone, password: data.password });
      showToast("Account created successfully!", "success");
      navigate("/");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-px section-y mx-auto flex max-w-md flex-col">
      <h1 className="mb-2 text-center font-display text-2xl font-bold">Create Your Account</h1>
      <p className="mb-8 text-center text-sm text-gray-500">Join JAM Smart Tech for faster checkout & repair tracking.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
        <div><label className="label">Full Name</label><input className="input" {...register("name", { required: true })} />{errors.name && <p className="mt-1 text-xs text-red-500">Name is required</p>}</div>
        <div><label className="label">Email</label><input type="email" className="input" {...register("email", { required: true })} />{errors.email && <p className="mt-1 text-xs text-red-500">Email is required</p>}</div>
        <div><label className="label">Phone</label><input className="input" {...register("phone")} /></div>
        <div><label className="label">Password</label><input type="password" className="input" {...register("password", { required: true, minLength: 8 })} />{errors.password && <p className="mt-1 text-xs text-red-500">Minimum 8 characters</p>}</div>
        <div><label className="label">Confirm Password</label><input type="password" className="input" {...register("confirmPassword", { validate: (v) => v === watch("password") || "Passwords do not match" })} />{errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}</div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading ? "Creating account..." : "Create Account"}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-semibold text-primary-600">Log In</Link></p>
    </div>
  );
};
export default Register;
