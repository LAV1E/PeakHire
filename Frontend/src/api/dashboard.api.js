import axiosInstance from "./axiosInstance";

// ─── Dashboard response shapes ────────────────────────────────────────────────

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  /**
   * GET /dashboard/candidate
   * Authenticated: candidate
   */
  candidate: async () => {
    const res = await axiosInstance.get("/dashboard/candidate");
    return res.data;
  },

  /**
   * GET /dashboard/recruiter
   * Authenticated: recruiter, admin
   * NOTE: company.isVerified is the correct field (not company.verificationStatus)
   */
  recruiter: async () => {
    const res = await axiosInstance.get("/dashboard/recruiter");
    return res.data;
  },

  /**
   * GET /dashboard/admin
   * Authenticated: admin
   */
  admin: async () => {
    const res = await axiosInstance.get("/dashboard/admin");
    return res.data;
  },
};
