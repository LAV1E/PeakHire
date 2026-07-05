"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROLE_DASHBOARDS } from "@/constants/routes";
/** * Root page: routes authenticated users to their role dashboard, * unauthenticated users to login. * This is also the landing page that middleware redirects to when * an authenticated user visits an auth page. */ export default function RootPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      router.replace(ROLE_DASHBOARDS[user.role]);
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, user, router]);
  return null;
}
