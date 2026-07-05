import axiosInstance from "./axiosInstance";

// ─── Notification API ─────────────────────────────────────────────────────────

export const notificationApi = {
  /**
   * GET /notifications
   * Authenticated: any role
   * Returns paginated notifications with sender populated
   */
  list: async (params) => {
    const res = await axiosInstance.get("/notifications", { params });
    return res.data;
  },

  /**
   * GET /notifications/unread-count
   * Authenticated: any role
   */
  unreadCount: async () => {
    const res = await axiosInstance.get("/notifications/unread-count");
    return res.data;
  },

  /**
   * PATCH /notifications/:id/read
   * Authenticated: any role — mark one as read
   */
  readOne: async (id) => {
    const res = await axiosInstance.patch(`/notifications/${id}/read`);
    return res.data;
  },

  /**
   * PATCH /notifications/read-all
   * Authenticated: any role — mark all as read
   */
  readAll: async () => {
    const res = await axiosInstance.patch("/notifications/read-all");
    return res.data;
  },

  /**
   * DELETE /notifications/:id
   * Authenticated: any role — soft delete one notification
   */
  deleteOne: async (id) => {
    const res = await axiosInstance.delete(`/notifications/${id}`);
    return res.data;
  },

  /**
   * DELETE /notifications
   * Authenticated: any role — soft delete all current user's notifications
   */
  deleteAll: async () => {
    const res = await axiosInstance.delete("/notifications");
    return res.data;
  },

  // ─── Legacy names used in existing pages ─────────────────────────────────

  /** @deprecated use list(params) */
  getNotifications: async (params) => {
    const r = await notificationApi.list(params);
    return {
      success: true,
      data: r.notifications,
      total: r.pagination?.totalItems ?? 0,
      page: r.pagination?.currentPage ?? 1,
      limit: params?.limit ?? 20,
      totalPages: r.pagination?.totalPages ?? 1,
    };
  },

  /** @deprecated use unreadCount() */
  getUnreadCount: async () => {
    const r = await notificationApi.unreadCount();
    return { success: true, data: { count: r.count } };
  },

  /** @deprecated use readOne(id) */
  markAsRead: async (id) => notificationApi.readOne(id),

  /** @deprecated use readAll() */
  markAllAsRead: async () => notificationApi.readAll(),

  /** @deprecated use deleteOne(id) */
  deleteNotification: async (id) => notificationApi.deleteOne(id),
};
