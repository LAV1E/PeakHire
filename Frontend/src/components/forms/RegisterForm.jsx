"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["candidate", "recruiter"], {
      message: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "candidate" },
  });
  
  const selectedRole = watch("role");
  
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (_, variables) => {
      toast.success("Account created! Please verify your email.");
      sessionStorage.setItem("verifyEmail", variables.email);
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    },
  });
  
  const onSubmit = (data) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      {/* Role Selection */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          {
            value: "candidate",
            label: "I'm a Candidate",
            icon: "person",
          },
          {
            value: "recruiter",
            label: "I'm a Recruiter",
            icon: "domain",
          },
        ].map((option) => (
          <div
            key={option.value}
            onClick={() => setValue("role", option.value)}
            className={cn(
              "rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all",
              selectedRole === option.value
                ? "border-2 border-[#0051d5] bg-surface-container-low hover:border-[#0051d5]"
                : "border border-outline-variant bg-surface-container-lowest hover:bg-surface-bright hover:border-outline"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-3",
                selectedRole === option.value
                  ? "bg-[#0051d5]/10"
                  : "bg-surface-variant"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined",
                  selectedRole === option.value
                    ? "text-[#0051d5]"
                    : "text-on-surface-variant"
                )}
              >
                {option.icon}
              </span>
            </div>
            <span
              className={cn(
                "font-label-md text-label-md",
                selectedRole === option.value
                  ? "text-[#0051d5] font-bold"
                  : "text-on-surface-variant"
              )}
            >
              {option.label}
            </span>
          </div>
        ))}
        {errors.role && (
          <p className="col-span-2 text-xs text-red-500 text-center">{errors.role.message}</p>
        )}
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="fullName">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline text-lg">badge</span>
            </div>
            <input
              id="fullName"
              placeholder="Jane Doe"
              className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
              {...register("name")}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline text-lg">mail</span>
            </div>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline text-lg">lock</span>
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline text-lg">lock_reset</span>
            </div>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-2 focus:ring-[#0051d5] focus:border-transparent font-body-md text-on-surface transition-colors"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full mt-2 py-2 px-4 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md hover:bg-secondary-fixed-variant transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex justify-center items-center"
        >
          {registerMutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>
    </motion.div>
  );
}
