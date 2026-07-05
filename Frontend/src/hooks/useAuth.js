"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { authApi } from "@/api/auth.api";
import { ROLE_DASHBOARDS } from "@/constants/routes";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function useAuth() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const router = useRouter();

  // ─── Login (email + password) ────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Backend sets accessToken + refreshToken cookies — we only store the user
      const userData = data.user;
      setUser({
        _id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified,
      });
      toast.success(`Welcome back, ${userData.name.split(" ")[0]}!`);
      router.push(ROLE_DASHBOARDS[userData.role]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    },
  });

  // ─── OTP Login ───────────────────────────────────────────────────────────
  const otpLoginMutation = useMutation({
    mutationFn: authApi.verifyLoginOtp,
    onSuccess: async (data) => {
      const userData = data.user;
      setUser({
        _id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified,
      });
      toast.success("Logged in successfully!");
      router.push(ROLE_DASHBOARDS[userData.role]);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Invalid OTP. Please try again.";
      toast.error(message);
    },
  });

  // ─── Logout ──────────────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout(); // clears server-side cookie
    } catch {
      // Ignore logout errors — clear local state regardless
    }
    logout();
    queryClient.clear();
    router.push("/login");
    toast.success("Logged out successfully");
  }, [logout, router]);

  // ─── Logout from all devices ─────────────────────────────────────────────
  const handleLogoutAll = useCallback(async () => {
    try {
      await authApi.logoutAllDevices();
    } catch {
      // Ignore errors
    }
    logout();
    queryClient.clear();
    router.push("/login");
    toast.success("Logged out from all devices");
  }, [logout, router]);

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    otpLogin: otpLoginMutation.mutate,
    isOtpLoggingIn: otpLoginMutation.isPending,
    logout: handleLogout,
    logoutAll: handleLogoutAll,
  };
}
