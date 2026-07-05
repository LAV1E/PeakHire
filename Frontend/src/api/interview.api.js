import axiosInstance from "./axiosInstance";

// ─── Payload types ────────────────────────────────────────────────────────────

// ─── Interview API ────────────────────────────────────────────────────────────

export const interviewApi = {
  /**
   * POST /interviews/schedule-interview
   * Authenticated: recruiter, admin
   * Application must be UNDER_REVIEW, SHORTLISTED, or INTERVIEW status
   */
  schedule: async (data) => {
    const res = await axiosInstance.post(
      "/interviews/schedule-interview",
      data,
    );
    return res.data;
  },

  /**
   * GET /interviews/recruiter
   * Authenticated: recruiter, admin
   */
  recruiterList: async (params) => {
    const res = await axiosInstance.get("/interviews/recruiter", { params });
    return res.data;
  },

  /**
   * GET /interviews/candidate
   * Authenticated: candidate, admin
   */
  candidateList: async (params) => {
    const res = await axiosInstance.get("/interviews/candidate", { params });
    return res.data;
  },

  /**
   * GET /interviews/getInterviewBy-id/:id
   * Authenticated: candidate, recruiter, admin
   * NOTE: Unusual casing — "getInterviewBy-id" is intentional (backend route)
   */
  getById: async (id) => {
    const res = await axiosInstance.get(`/interviews/getInterviewBy-id/${id}`);
    return res.data;
  },

  /**
   * PUT /interviews/update-Interview/:id
   * Authenticated: recruiter, admin
   * NOTE: Capital I in "update-Interview" — backend route is case-sensitive
   */
  update: async (id, data) => {
    const res = await axiosInstance.put(
      `/interviews/update-Interview/${id}`,
      data,
    );
    return res.data;
  },

  /**
   * PATCH /interviews/cancel-Interview/:id
   * Authenticated: recruiter, admin
   * NOTE: Capital I in "cancel-Interview" — backend route is case-sensitive
   */
  cancel: async (id) => {
    const res = await axiosInstance.patch(`/interviews/cancel-Interview/${id}`);
    return res.data;
  },

  // ─── Legacy names used in existing pages ─────────────────────────────────

  /** @deprecated use candidateList(params) */
  getMyInterviews: async (params) => {
    const r = await interviewApi.candidateList(params);
    return { success: true, data: r.interviews };
  },

  /** @deprecated use recruiterList(params) */
  getAllInterviews: async (params) => {
    const r = await interviewApi.recruiterList(params);
    return { success: true, data: r.interviews, total: r.totalInterviews };
  },

  /** @deprecated use cancel(id) */
  cancelInterview: async (id) => {
    return interviewApi.cancel(id);
  },

  /** @deprecated use schedule(data) */
  scheduleInterview: async (data) => {
    return interviewApi.schedule(data);
  },
};
