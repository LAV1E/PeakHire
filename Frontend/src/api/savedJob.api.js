import axiosInstance from "./axiosInstance";

// ─── Saved Jobs API ───────────────────────────────────────────────────────────

export const savedJobApi = {
  /**
   * POST /saved-jobs/:jobId
   * Authenticated: candidate — saves a published job
   * Returns 409 if already saved
   */
  save: async (jobId) => {
    const res = await axiosInstance.post(`/saved-jobs/${jobId}`);
    return res.data;
  },

  /**
   * GET /saved-jobs/
   * Authenticated: candidate — list of saved jobs (filters deleted/unpublished)
   */
  list: async () => {
    const res = await axiosInstance.get("/saved-jobs/");
    return res.data;
  },

  /**
   * DELETE /saved-jobs/:jobId
   * Authenticated: candidate — unsave a job
   */
  remove: async (jobId) => {
    const res = await axiosInstance.delete(`/saved-jobs/${jobId}`);
    return res.data;
  },

  /**
   * GET /saved-jobs/check/:jobId
   * Authenticated: candidate — check if a specific job is saved
   */
  check: async (jobId) => {
    const res = await axiosInstance.get(`/saved-jobs/check/${jobId}`);
    return res.data;
  },

  // ─── Legacy names used in existing pages ─────────────────────────────────

  /** @deprecated use save(jobId) */
  saveJob: async (id) => savedJobApi.save(id),

  /** @deprecated use remove(jobId) */
  unsaveJob: async (id) => savedJobApi.remove(id),

  /** @deprecated use list() */
  getSavedJobs: async () => {
    const r = await savedJobApi.list();
    return { success: true, data: r.savedJobs };
  },
};
