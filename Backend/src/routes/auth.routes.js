import express from "express";

import { registerUser,verifyEmail,loginUser,sendLoginOtp,verifyLoginOtp,logoutUser,getCurrentUser,forgotPassword,resetPassword,refreshToken,logoutAllDevices,getSessions,} from "../controllers/auth.controller.js";

import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", authUser, logoutUser);

/**
 * @swagger
 * /api/auth/current-user:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 */
router.get("/current-user", authUser, getCurrentUser);

/**
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify-email", verifyEmail);

/**
 * @swagger
 * /api/auth/send-login-otp:
 *   post:
 *     summary: Send OTP for login
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post("/send-login-otp", sendLoginOtp);

/**
 * @swagger
 * /api/auth/verify-login-otp:
 *   post:
 *     summary: Verify login OTP
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: OTP verified successfully
 */
router.post("/verify-login-otp", verifyLoginOtp);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post("/reset-password", resetPassword);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Generate new access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/logout-all-devices:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices
 */
router.post("/logout-all-devices", authUser, logoutAllDevices);

/**
 * @swagger
 * /api/auth/sessions:
 *   get:
 *     summary: Get all active sessions
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessions fetched successfully
 */
router.get("/sessions", authUser, getSessions);

export default router;