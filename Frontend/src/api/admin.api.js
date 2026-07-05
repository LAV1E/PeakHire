import axiosInstance from "./axiosInstance";

// ─── Admin API ────────────────────────────────────────────────────────────────
// Admin uses the same company + dashboard endpoints with admin role access.

export const adminApi = {
  /**
   * GET /dashboard/admin
   * Authenticated: admin
   */
  getDashboard: async () => {
    const res = await axiosInstance.get("/dashboard/admin");
    return res.data;
  },

  /**
   * GET /company/pending-companies
   * Authenticated: admin — returns unverified companies
   */
  getPendingCompanies: async () => {
    const res = await axiosInstance.get("/company/pending-companies");
    return res.data;
  },

  /**
   * PATCH /company/verify-company/:id
   * Authenticated: admin — marks company verified
   */
  verifyCompany: async (id) => {
    const res = await axiosInstance.patch(`/company/verify-company/${id}`);
    return res.data;
  },

  /**
   * DELETE /company/delete-company/:id
   * Authenticated: admin
   */
  deleteCompany: async (id) => {
    const res = await axiosInstance.delete(`/company/delete-company/${id}`);
    return res.data;
  },

  /**
   * GET /admin/users
   * Authenticated: admin
   */
  getUsers: async () => {
    const res = await axiosInstance.get("/admin/users"); // fallback endpoint assumption
    return res.data;
  },

  updateUserStatus: async (id, isActive) => {
    const endpoint = isActive ? `/admin/unblock-user/${id}` : `/admin/block-user/${id}`;
    const res = await axiosInstance.patch(endpoint);
    return res.data;
  },

  // ─── Legacy names used in existing pages ─────────────────────────────────

  /** @deprecated use getDashboard() */
  getStats: async () => {
    return adminApi.getDashboard();
  },

  /** Fetch all companies (both verified and unverified) */
  getAllCompanies: async () => {
    const res = await axiosInstance.get("/company/all-companies");
    return res.data;
  },
};
