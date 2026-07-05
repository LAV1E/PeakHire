import axiosInstance from "./axiosInstance";

// ─── Payload types ────────────────────────────────────────────────────────────

// ─── Job API ──────────────────────────────────────────────────────────────────

export const jobApi = {
  /**
   * POST /job/create-job
   * Authenticated: recruiter, admin — must own a verified company
   */
  createJob: async (data) => {
    const res = await axiosInstance.post("/job/create-job", data);
    return res.data;
  },

  /**
   * GET /job/my-jobs
   * Authenticated: recruiter, admin — jobs for current user's company
   */
  myJobs: async () => {
    const res = await axiosInstance.get("/job/my-jobs");
    return res.data;
  },

  /**
   * PUT /job/update-job/:id
   * Authenticated: recruiter (must have created the job), admin
   */
  updateJob: async (id, data) => {
    const res = await axiosInstance.put(`/job/update-job/${id}`, data);
    return res.data;
  },

  /**
   * DELETE /job/delete-job/:id
   * Authenticated: recruiter, admin — soft delete
   */
  deleteJob: async (id) => {
    const res = await axiosInstance.delete(`/job/delete-job/${id}`);
    return res.data;
  },

  /**
   * GET /job/jobs
   * Public — all published, non-deleted jobs
   */
  listJobs: async () => {
    const res = await axiosInstance.get("/job/jobs");
    return res.data;
  },

  /**
   * GET /job/job/:id
   * Public — single job detail, increments viewsCount
   */
  getJobById: async (id) => {
    const res = await axiosInstance.get(`/job/job/${id}`);
    return res.data;
  },

  /**
   * GET /job/featured-jobs
   * Public — featured published jobs
   */
  featuredJobs: async () => {
    const res = await axiosInstance.get("/job/featured-jobs");
    return res.data;
  },

  /**
   * GET /job/search?keyword=...
   * Public — full-text search. Do NOT call with empty keyword.
   */
  searchJobs: async (keyword) => {
    if (!keyword?.trim()) return { success: true, totalJobs: 0, jobs: [] };
    const res = await axiosInstance.get("/job/search", { params: { keyword } });
    return res.data;
  },

  /**
   * GET /job/advanced-search
   * Public — filtered/paginated job search
   */
  advancedSearch: async (params) => {
    const res = await axiosInstance.get("/job/advanced-search", { params });
    return res.data;
  },

  // ─── Legacy names used in existing pages ───────────────────────────────────

  /** @deprecated use listJobs or advancedSearch */
  getJobs: async (filters) => {
    if (filters?.keyword || filters?.search) {
      const keyword = filters.keyword || filters.search || "";
      return jobApi.searchJobs(keyword).then((r) => ({
        success: true,
        data: r.jobs,
        total: r.totalJobs,
        totalPages: 1,
        page: 1,
      }));
    }
    const params = {
      location: filters?.location,
      employmentType: filters?.employmentType,
      experienceLevel: filters?.experienceLevel,
      minSalary: filters?.minSalary,
      maxSalary: filters?.maxSalary,
      page: filters?.page,
      limit: filters?.limit,
    };
    return jobApi.advancedSearch(params).then((r) => ({
      success: true,
      data: r.jobs,
      total: r.totalJobs,
      totalPages: r.totalPages,
      page: r.page,
    }));
  },

  /** @deprecated use myJobs */
  getMyJobs: async () => {
    const r = await jobApi.myJobs();
    return { success: true, data: r.jobs };
  },
};
