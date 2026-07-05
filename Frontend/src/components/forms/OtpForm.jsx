"use client";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react";

export function OtpForm({ email }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);
  const router = useRouter();
  
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);
  
  const verifyMutation = useMutation({
    mutationFn: () => authApi.verifyEmail({ email, otp: otp.join("") }),
    onSuccess: () => {
      toast.success("Email verified! Please log in.");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Invalid or expired OTP");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    },
  });
  
  const resendMutation = useMutation({
    mutationFn: () => authApi.resendOtp(email),
    onSuccess: () => {
      toast.success("OTP resent! Check your email.");
      setCooldown(60);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    },
  });
  
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newOtp.every(Boolean) && newOtp.join("").length === 6) {
      verifyMutation.mutate();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
      verifyMutation.mutate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between gap-2 sm:gap-4 w-full">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            id={`otp-${index}`}
            placeholder="•"
            className="w-12 h-14 sm:w-14 sm:h-16 text-center font-headline-md text-headline-md text-on-surface bg-surface border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
            style={{
              borderColor: digit ? "var(--secondary)" : "var(--outline-variant)",
            }}
          />
        ))}
      </div>
      
      <button
        onClick={() => verifyMutation.mutate()}
        disabled={otp.join("").length !== 6 || verifyMutation.isPending}
        className="w-full h-12 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg hover:bg-secondary/90 transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {verifyMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          "Verify"
        )}
      </button>

      <div className="mt-6 text-center flex flex-col items-center justify-center gap-2">
        <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
          Didn&apos;t receive the code?
        </p>
        <button
          type="button"
          onClick={() => resendMutation.mutate()}
          disabled={cooldown > 0 || resendMutation.isPending}
          className="font-label-md text-label-md text-secondary hover:text-secondary/80 transition-colors disabled:text-outline disabled:cursor-not-allowed flex items-center gap-1 group"
        >
          <span>{resendMutation.isPending ? "Sending..." : "Resend code"}</span>
          {cooldown > 0 && (
            <span className="text-on-surface-variant group-disabled:text-outline font-body-md">
              (0:{cooldown < 10 ? `0${cooldown}` : cooldown})
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}
