import express from "express";

import {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  getInterviewById,
  updateInterview,
  cancelInterview,
} from "../controllers/interview.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Recruiter
/**
 * @swagger
 * /api/interviews/schedule-interview:
 *   post:
 *     summary: Schedule interview
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Interview scheduled successfully
 */
router.post("/schedule-interview",authUser,authorizeRoles("recruiter","admin"),scheduleInterview);

//can be filtered by status and mode
//GET /api/interviews/recruiter?status=SCHEDULED   , GET /api/interviews/recruiter?mode=ONLINE
/**
 * @swagger
 * /api/interviews/recruiter:
 *   get:
 *     summary: Get recruiter interviews
 *     tags: [Interviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Interviews fetched successfully
 */
router.get("/recruiter",authUser,authorizeRoles("recruiter","admin"),getRecruiterInterviews);

router.put("/update-Interview/:id",authUser,authorizeRoles("recruiter","admin"),updateInterview);

router.patch("/cancel-Interview/:id",authUser,authorizeRoles("recruiter","admin"),cancelInterview);

// Candidate

router.get("/candidate",authUser,authorizeRoles("candidate","admin"),getCandidateInterviews);

// Common

router.get("/getInterviewBy-id/:id",authUser,authorizeRoles("candidate","recruiter","admin"),getInterviewById);

export default router;