"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAuthStore } from "@/store/authStore";

/**
 * Bootstraps the current user session by calling GET /auth/current-user.
 * The backend reads the accessToken cookie automatically.
 * On success, updates the auth store with the full user document.
 * On 401 (cookie expired/missing), the axios interceptor will attempt refresh first.
 */
export function useCurrentUser() {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  const query = useQuery({
    queryKey: QUERY_KEYS.ME,
    queryFn: async () => {
      const res = await authApi.currentUser();
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
      return null;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // axios interceptor handles refresh; don't double-retry
  });

  return query;
}
