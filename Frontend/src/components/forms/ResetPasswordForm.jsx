"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const resetSchema = z
  .object({
    email: z.string().email("Enter a valid email address"),
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must be numeric"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: emailFromQuery },
  });
  
  const mutation = useMutation({
    mutationFn: (data) =>
      authApi.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password reset successfully! Please log in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to reset password. Check your OTP."
      );
    },
  });

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-4 w-full"
    >
      {/* Email Input */}
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="reset-email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline text-lg">mail</span>
          </div>
          <input
            id="reset-email"
            type="email"
            placeholder="you@example.com"
            className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* OTP Input */}
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="reset-otp">
          OTP Code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline text-lg">password</span>
          </div>
          <input
            id="reset-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="w-full pl-10 pr-3 py-2 tracking-widest bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
            {...register("otp")}
          />
        </div>
        {errors.otp && (
          <p className="mt-1 text-xs text-red-500">{errors.otp.message}</p>
        )}
      </div>

      {/* New Password Input */}
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="new-password">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline text-lg">lock</span>
          </div>
          <input
            id="new-password"
            type="password"
            placeholder="Min 8 characters"
            className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
            {...register("newPassword")}
          />
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      {/* Confirm New Password Input */}
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="confirm-new-password">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline text-lg">lock_reset</span>
          </div>
          <input
            id="confirm-new-password"
            type="password"
            placeholder="Repeat password"
            className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full mt-4 py-2 px-4 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-secondary-container hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex justify-center items-center"
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Resetting...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>
    </motion.form>
  );
}
