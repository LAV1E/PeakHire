import axiosInstance from "./axiosInstance";

// ─── Profile update payload (backend: PUT /profile/update) ────────────────────

// ─── Profile API ──────────────────────────────────────────────────────────────

export const profileApi = {
  /**
   * GET /profile/me
   * Authenticated — returns full profile (excludes password / OTP fields)
   */
  me: async () => {
    const res = await axiosInstance.get("/profile/me");
    return res.data;
  },

  /**
   * PUT /profile/update
   * Authenticated — updates profile fields
   */
  update: async (data) => {
    const res = await axiosInstance.put("/profile/update", data);
    return res.data;
  },

  /**
   * POST /profile/upload-avatar
   * Authenticated — multipart, field: "avatar", max 2MB, JPEG/PNG/WEBP
   */
  uploadAvatar: async (file) => {
    const form = new FormData();
    form.append("avatar", file);
    const res = await axiosInstance.post("/profile/upload-avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * GET /profile/:userId
   * Authenticated — returns public candidate profile
   */
  publicProfile: async (userId) => {
    const res = await axiosInstance.get(`/profile/${userId}`);
    return res.data;
  },
};

// ─── Resume API ───────────────────────────────────────────────────────────────

export const resumeApi = {
  /**
   * POST /resume/upload-resume
   * Authenticated — multipart, field: "resume", max 5MB, PDF/DOC/DOCX
   */
  uploadResume: async (file) => {
    const form = new FormData();
    form.append("resume", file);
    const res = await axiosInstance.post("/resume/upload-resume", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * GET /resume/my-resume
   * Authenticated — returns current user's resume asset
   */
  getMyResume: async () => {
    const res = await axiosInstance.get("/resume/my-resume");
    return res.data;
  },

  /**
   * DELETE /resume/delete-resume
   * Authenticated — deletes resume from Cloudinary and clears user.resume
   * CAUTION: Backend may fail if resume was uploaded as resource_type "raw"
   */
  deleteResume: async () => {
    const res = await axiosInstance.delete("/resume/delete-resume");
    return res.data;
  },
};

// ─── Legacy userApi re-export for backwards-compat ────────────────────────────
// Components still importing from user.api use these names.

export const userApi = {
  uploadAvatar: profileApi.uploadAvatar,
  updateProfile: profileApi.update,
  uploadResume: resumeApi.uploadResume,
  getMyResume: resumeApi.getMyResume,
  deleteResume: resumeApi.deleteResume,
  me: profileApi.me,
  publicProfile: profileApi.publicProfile,
};
