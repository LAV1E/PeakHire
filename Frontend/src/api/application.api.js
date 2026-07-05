import axiosInstance from "./axiosInstance";

// ─── Payload types ────────────────────────────────────────────────────────────

// ─── Application API ──────────────────────────────────────────────────────────

export const applicationApi = {
  /**
   * POST /application/apply/:jobId
   * Authenticated: candidate
   * IMPORTANT: Pass resume: profile.resume.url to avoid backend type mismatch
   */
  apply: async (jobId, data) => {
    const res = await axiosInstance.post(
      `/application/apply/${jobId}`,
      data ?? {},
    );
    return res.data;
  },

  /**
   * GET /application/my-applications
   * Authenticated: candidate
   */
  myApplications: async () => {
    const res = await axiosInstance.get("/application/my-applications");
    return res.data;
  },

  /**
   * PATCH /application/withdraw/:id
   * Authenticated: candidate (own application only)
   */
  withdraw: async (id) => {
    const res = await axiosInstance.patch(`/application/withdraw/${id}`);
    return res.data;
  },

  /**
   * GET /application/job/:jobId
   * Authenticated: recruiter, admin — recruiter must own job
   */
  applicationsForJob: async (jobId) => {
    const res = await axiosInstance.get(`/application/job/${jobId}`);
    return res.data;
  },

  /**
   * GET /application/:id
   * Authenticated: recruiter, admin
   */
  applicationById: async (id) => {
    const res = await axiosInstance.get(`/application/${id}`);
    return res.data;
  },

  /**
   * PATCH /application/update-status/:id
   * Authenticated: recruiter, admin
   * Allowed statuses: UNDER_REVIEW, SHORTLISTED, INTERVIEW, OFFERED, HIRED, REJECTED
   */
  updateStatus: async (id, data) => {
    const res = await axiosInstance.patch(
      `/application/update-status/${id}`,
      data,
    );
    return res.data;
  },

  /**
   * DELETE /application/delete/:id
   * Authenticated: admin only — soft delete
   */
  adminDelete: async (id) => {
    const res = await axiosInstance.delete(`/application/delete/${id}`);
    return res.data;
  },

  // ─── Legacy names used in existing pages ───────────────────────────────────

  /** @deprecated use apply(jobId, data) */
  applyForJob: async (data) => {
    return applicationApi.apply(data.jobId, {
      resume: data.resume,
      coverLetter: data.coverLetter,
    });
  },

  /** @deprecated use myApplications() */
  getMyApplications: async (_params) => {
    const r = await applicationApi.myApplications();
    return {
      success: true,
      data: r.applications,
      total: r.totalApplications,
      totalApplications: r.totalApplications,
    };
  },

  /** @deprecated use applicationsForJob() */
  getApplicationsForJob: async (jobId) => {
    return applicationApi.applicationsForJob(jobId);
  },

  /** @deprecated use applicationById() */
  getApplicationById: async (id) => {
    return applicationApi.applicationById(id);
  },

  /** @deprecated use updateStatus() */
  updateApplicationStatus: async (id, status) => {
    return applicationApi.updateStatus(id, { status: status });
  },

  /** @deprecated use withdraw() */
  withdrawApplication: async (id) => {
    return applicationApi.withdraw(id);
  },
};
