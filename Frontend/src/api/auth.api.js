import axiosInstance from "./axiosInstance";

// ─── Payload types ────────────────────────────────────────────────────────────

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  /**
   * POST /auth/register
   * Public — creates user and sends verification email
   */
  register: async (payload) => {
    const res = await axiosInstance.post("/auth/register", payload);
    return res.data;
  },

  /**
   * POST /auth/login
   * Public — sets accessToken + refreshToken cookies on the server
   */
  login: async (payload) => {
    const res = await axiosInstance.post("/auth/login", payload);
    return res.data;
  },

  /**
   * POST /auth/logout
   * Authenticated — clears server cookie
   */
  logout: async () => {
    const res = await axiosInstance.post("/auth/logout");
    return res.data;
  },

  /**
   * POST /auth/logout-all-devices
   * Authenticated — clears all sessions
   */
  logoutAllDevices: async () => {
    const res = await axiosInstance.post("/auth/logout-all-devices");
    return res.data;
  },

  /**
   * GET /auth/current-user
   * Authenticated — full user document for bootstrapping
   */
  currentUser: async () => {
    const res = await axiosInstance.get("/auth/current-user");
    return res.data;
  },

  /**
   * POST /auth/verify-email
   * Public — verifies email with OTP sent during registration
   */
  verifyEmail: async (payload) => {
    const res = await axiosInstance.post("/auth/verify-email", payload);
    return res.data;
  },

  /**
   * POST /auth/send-login-otp
   * Public — sends OTP for OTP-based login
   */
  sendLoginOtp: async (payload) => {
    const res = await axiosInstance.post("/auth/send-login-otp", payload);
    return res.data;
  },

  /**
   * POST /auth/verify-login-otp
   * Public — verifies OTP and sets cookies (same as login)
   */
  verifyLoginOtp: async (payload) => {
    const res = await axiosInstance.post("/auth/verify-login-otp", payload);
    return res.data;
  },

  /**
   * POST /auth/forgot-password
   * Public — sends OTP for password reset
   */
  forgotPassword: async (payload) => {
    const res = await axiosInstance.post("/auth/forgot-password", payload);
    return res.data;
  },

  /**
   * POST /auth/reset-password
   * Public — resets password using email + OTP + newPassword
   */
  resetPassword: async (payload) => {
    const res = await axiosInstance.post("/auth/reset-password", payload);
    return res.data;
  },

  /**
   * POST /auth/refresh-token
   * Uses refreshToken cookie — called automatically by axios interceptor
   */
  refreshToken: async () => {
    const res = await axiosInstance.post("/auth/refresh-token");
    return res.data;
  },

  /**
   * GET /auth/sessions
   * Authenticated — returns active sessions (excludes refresh tokens)
   */
  sessions: async () => {
    const res = await axiosInstance.get("/auth/sessions");
    return res.data;
  },

  /**
   * Resend email verification OTP.
   * NOTE: The backend has no dedicated resend-verification endpoint.
   * This calls forgot-password which sends a reset OTP — not ideal for
   * email verification resend. Users who expire their registration OTP
   * should re-register or contact support.
   * @deprecated — kept for OtpForm backward compatibility
   */
  resendOtp: async (email) => {
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
  },
};
