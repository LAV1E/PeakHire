"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationApi } from "@/api/notification.api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export function useNotifications() {
  const { isAuthenticated } = useAuthStore();
  const { setUnreadCount } = useNotificationStore();

  const unreadCountQuery = useQuery({
    queryKey: QUERY_KEYS.UNREAD_COUNT,
    queryFn: async () => {
      const res = await notificationApi.unreadCount();
      // Backend returns { success: true, count: number }
      return res.count;
    },
    enabled: isAuthenticated,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });

  const notificationsQuery = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: async () => {
      const res = await notificationApi.list({ limit: 5 });
      // Backend returns { success, pagination, notifications }
      return res.notifications;
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (unreadCountQuery.data !== undefined) {
      setUnreadCount(unreadCountQuery.data);
    }
  }, [unreadCountQuery.data, setUnreadCount]);

  return {
    unreadCount: unreadCountQuery.data ?? 0,
    notifications: notificationsQuery.data ?? [],
    isLoadingCount: unreadCountQuery.isLoading,
    isLoadingNotifications: notificationsQuery.isLoading,
  };
}
