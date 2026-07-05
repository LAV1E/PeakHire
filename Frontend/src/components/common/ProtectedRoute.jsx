"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      /* Redirect to their own dashboard */ const dashboards = {
        candidate: "/candidate/dashboard",
        recruiter: "/recruiter/dashboard",
        admin: "/admin/dashboard",
      };
      router.push(dashboards[user.role]);
    }
  }, [isAuthenticated, user, allowedRoles, router]);
  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;
  return <>{children}</>;
}
