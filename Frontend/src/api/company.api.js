import axiosInstance from "./axiosInstance";

// ─── Payload types ────────────────────────────────────────────────────────────

// ─── Company API ──────────────────────────────────────────────────────────────

export const companyApi = {
  /**
   * POST /company/create-company
   * Authenticated: recruiter, admin
   */
  createCompany: async (data) => {
    const res = await axiosInstance.post("/company/create-company", data);
    return res.data;
  },

  /**
   * GET /company/getMyCompany
   * Authenticated: recruiter, admin
   */
  getMyCompany: async () => {
    const res = await axiosInstance.get("/company/getMyCompany");
    return res.data;
  },

  /**
   * PUT /company/update-Company/:id
   * Authenticated: recruiter (must own), admin
   * NOTE: Route is case-sensitive — "update-Company" with capital C
   */
  updateCompany: async (id, data) => {
    const res = await axiosInstance.put(`/company/update-Company/${id}`, data);
    return res.data;
  },

  /**
   * DELETE /company/delete-company/:id
   * Authenticated: recruiter (must own), admin
   */
  deleteCompany: async (id) => {
    const res = await axiosInstance.delete(`/company/delete-company/${id}`);
    return res.data;
  },

  /**
   * PATCH /company/verify-company/:id
   * Authenticated: admin only
   */
  verifyCompany: async (id) => {
    const res = await axiosInstance.patch(`/company/verify-company/${id}`);
    return res.data;
  },

  /**
   * GET /company/pending-companies
   * Authenticated: admin only
   */
  pendingCompanies: async () => {
    const res = await axiosInstance.get("/company/pending-companies");
    return res.data;
  },
};
