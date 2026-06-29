import express from "express";

import {
  applyJob,
  getMyApplications,
  getApplicationsForJob,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  deleteApplication,
} from "../controllers/application.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Candidate Routes
|--------------------------------------------------------------------------
*/
/**
 * @swagger
 * /api/application/apply/{jobId}:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Application submitted successfully
 */

// Apply for a job
router.post("/apply/:jobId",authUser,authorizeRoles("candidate"),applyJob);

// Get candidate's own applications
/**
 * @swagger
 * /api/application/my-applications:
 *   get:
 *     summary: Get candidate applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Applications fetched successfully
 */
router.get("/my-applications",authUser,authorizeRoles("candidate"),getMyApplications);

// Withdraw application
router.patch("/withdraw/:id",authUser,authorizeRoles("candidate"),withdrawApplication);

/*
|--------------------------------------------------------------------------
| Recruiter Routes
|--------------------------------------------------------------------------
*/
// Get all applications for a specific job
router.get("/job/:jobId",authUser,authorizeRoles("recruiter", "admin"),getApplicationsForJob);

// Get single application      /api/application/:applicationId
router.get("/:id",authUser,authorizeRoles("recruiter", "admin"),getApplicationById);

// Update application status   /api/application/update-status/:applicationId
/**
 * @swagger
 * /api/application/update-status/{id}:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.patch("/update-status/:id",authUser,authorizeRoles("recruiter", "admin"),updateApplicationStatus);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

// Soft delete application
router.delete("/delete/:id",authUser,authorizeRoles("admin"),deleteApplication);

export default router;