import axiosInstance from "./axiosInstance";

// ─── AI API ───────────────────────────────────────────────────────────────────

export const aiApi = {
  /**
   * GET /ai/resume-analysis
   * Authenticated: candidate, admin
   * Requires uploaded resume. Returns cached result if analysis already exists.
   */
  resumeAnalysis: async () => {
    const res = await axiosInstance.get("/ai/resume-analysis");
    return res.data;
  },
};
