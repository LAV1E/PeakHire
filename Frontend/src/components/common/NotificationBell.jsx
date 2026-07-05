"use client";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelative } from "@/utils/dateUtils";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { notificationApi } from "@/api/notification.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
const NOTIFICATION_ICONS = {
  COMPANY_VERIFIED: "🏢",
  COMPANY_REJECTED: "❌",
  APPLICATION_RECEIVED: "📨",
  APPLICATION_STATUS_UPDATED: "📋",
  INTERVIEW_SCHEDULED: "📅",
  INTERVIEW_CANCELLED: "🚫",
  OFFER_SENT: "🎁",
  OFFER_ACCEPTED: "✅",
  OFFER_REJECTED: "❌",
  GENERAL: "🔔",
};
export function NotificationBell() {
  const { unreadCount, notifications } = useNotifications();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const role = user?.role ?? "candidate";
  const notifRoute =
    role === "admin"
      ? ROUTES.ADMIN_NOTIFICATIONS
      : role === "recruiter"
        ? ROUTES.RECRUITER_NOTIFICATIONS
        : ROUTES.CANDIDATE_NOTIFICATIONS;
  const markAllMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_COUNT });
    },
  });
  return (
    <Popover>
      {" "}
      <PopoverTrigger className="relative p-2 rounded-full transition-colors duration-200 ease-out hover:bg-gray-100 transition-colors">
        {" "}
        <Bell size={20} className="text-on-surface-variant " />{" "}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {" "}
            {unreadCount > 99 ? "99+" : unreadCount}{" "}
          </span>
        )}{" "}
      </PopoverTrigger>{" "}
      <PopoverContent align="end" className="w-80 p-0 shadow-xl">
        {" "}
        <div className="flex items-center justify-between px-4 py-3 border-b ">
          {" "}
          <h3 className="font-semibold text-sm text-on-surface ">
            {" "}
            Notifications{" "}
          </h3>{" "}
          {unreadCount > 0 && (
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {" "}
              Mark all read{" "}
            </button>
          )}{" "}
        </div>{" "}
        <div className="divide-y max-h-80 overflow-y-auto">
          {" "}
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-on-surface-variant ">
              {" "}
              <Bell className="mx-auto mb-2 opacity-30" size={24} /> No
              notifications yet{" "}
            </div>
          ) : (
            notifications.slice(0, 5).map((notif) => (
              <div
                key={notif._id}
                className={cn(
                  "px-4 py-3 transition-colors duration-200 ease-out hover:bg-surface-container-low transition-colors",
                  !notif.isRead && "bg-blue-50/50 ",
                )}
              >
                {" "}
                <div className="flex items-start gap-3">
                  {" "}
                  <span className="text-lg mt-0.5">
                    {" "}
                    {NOTIFICATION_ICONS[notif.type] ?? "🔔"}{" "}
                  </span>{" "}
                  <div className="flex-1 min-w-0">
                    {" "}
                    <p className="text-sm text-on-surface leading-snug">
                      {" "}
                      {notif.message}{" "}
                    </p>{" "}
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      {" "}
                      {formatRelative(notif.createdAt)}{" "}
                    </p>{" "}
                  </div>{" "}
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1 flex-shrink-0" />
                  )}{" "}
                </div>{" "}
              </div>
            ))
          )}{" "}
        </div>{" "}
        <div className="px-4 py-3 border-t ">
          {" "}
          <Link
            href={notifRoute}
            className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {" "}
            View all notifications{" "}
          </Link>{" "}
        </div>{" "}
      </PopoverContent>{" "}
    </Popover>
  );
}
