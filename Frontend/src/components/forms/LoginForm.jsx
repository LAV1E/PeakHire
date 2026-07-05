"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });
  
  const onSubmit = (data) => {
    login({ email: data.email, password: data.password });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Email Field */}
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface mb-1.5" htmlFor="email">
          Email address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
          </div>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            className="block w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-shadow duration-200"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block font-label-sm text-label-sm text-on-surface" htmlFor="password">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="font-label-sm text-label-sm text-secondary hover:text-secondary-fixed-variant transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="block w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-[#E2E8F0] rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-shadow duration-200"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-on-surface-variant hover:text-on-surface focus:outline-none transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-secondary bg-secondary hover:bg-secondary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors duration-200"
        >
          {isLoggingIn ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </div>
    </motion.form>
  );
}
