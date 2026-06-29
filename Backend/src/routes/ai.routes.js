import express from "express";
import {analyzeMyResume,} from "../controllers/ai.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import {authorizeRoles,} from "../middleware/role.middleware.js";

const router = express.Router();
/**
 * @swagger
 * /api/ai/resume-analysis:
 *   get:
 *     summary: Analyze uploaded resume using AI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resume analyzed successfully
 */
router.get("/resume-analysis",authUser,authorizeRoles("candidate","admin"),analyzeMyResume);

export default router;