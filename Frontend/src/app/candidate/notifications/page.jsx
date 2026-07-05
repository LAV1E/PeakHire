"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { notificationApi } from "@/api/notification.api";
import { toast } from "sonner";
import { formatRelative } from "@/utils/dateUtils";
import { cn } from "@/lib/utils";

const NOTIFICATION_ICONS = {
  COMPANY_VERIFIED: "business",
  COMPANY_REJECTED: "domain_disabled",
  APPLICATION_RECEIVED: "move_to_inbox",
  APPLICATION_STATUS_UPDATED: "assignment",
  INTERVIEW_SCHEDULED: "calendar_month",
  INTERVIEW_CANCELLED: "event_busy",
  OFFER_SENT: "card_giftcard",
  OFFER_ACCEPTED: "check_circle",
  OFFER_REJECTED: "cancel",
  GENERAL: "notifications",
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: async () =>
      (await notificationApi.getNotifications({ limit: 50 })).data,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_COUNT });
      toast.success("All notifications marked as read");
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_COUNT });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });

  const notifications = data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="pt-8 pb-12 max-w-container_max mx-auto min-h-[calc(100vh-64px)]">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-background mb-2">Notifications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">You have {unreadCount} unread messages</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Mark all read
          </button>
        )}
      </header>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="animate-pulse flex flex-col divide-y divide-outline-variant/30">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-container-highest shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-container-highest rounded w-3/4" />
                  <div className="h-3 bg-surface-container-highest rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border-t border-outline-variant border-dashed m-4 rounded-xl bg-surface-bright">
            <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px] text-on-surface-variant">notifications_paused</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2">No notifications</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-outline-variant/50">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={cn(
                  "flex items-start gap-4 px-6 py-4 transition-colors duration-200 group hover:bg-surface-container-low",
                  !notif.isRead ? "bg-primary-fixed/20" : "bg-surface-container-lowest"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1 transition-colors",
                  !notif.isRead ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-variant text-on-surface-variant"
                )}>
                  <span className="material-symbols-outlined text-[20px]">
                    {NOTIFICATION_ICONS[notif.type] ?? "notifications"}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className={cn(
                    "font-body-md text-body-md leading-relaxed",
                    notif.isRead ? "text-on-surface-variant" : "text-on-surface font-semibold"
                  )}>
                    {notif.message}
                  </p>
                  <p className="font-helper-text text-helper-text text-on-surface-variant mt-1">
                    {formatRelative(notif.createdAt)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  {!notif.isRead && (
                    <button
                      onClick={() => markReadMutation.mutate(notif._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-variant hover:text-secondary transition-colors"
                      title="Mark as read"
                    >
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(notif._id)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
                
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-secondary mt-5 shrink-0 shadow-sm" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
