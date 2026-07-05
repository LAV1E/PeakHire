"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema) });
  
  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      setSubmitted(true);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send reset OTP");
    },
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4 border border-outline-variant">
          <span className="material-symbols-outlined text-[#0051d5] text-3xl">check_circle</span>
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
          Check your email
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          We&apos;ve sent a 6-digit OTP to your email address. It expires in 5 minutes.
        </p>
        <button
          onClick={() =>
            router.push(
              `/reset-password?email=${encodeURIComponent(submittedEmail)}`
            )
          }
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-secondary bg-secondary hover:bg-secondary-container hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
        >
          Enter OTP &amp; Reset Password
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-6"
    >
      <div>
        <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1.5 ml-0.5" htmlFor="forgot-email">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline-variant text-[20px]">mail</span>
          </div>
          <input
            id="forgot-email"
            type="email"
            placeholder="name@company.com"
            className="block w-full pl-10 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 ml-0.5">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-secondary bg-secondary hover:bg-[#003ea8] hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          "Send reset link"
        )}
      </button>
    </motion.form>
  );
}
