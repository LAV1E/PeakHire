import express from "express";

import {
  createJob,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAllJobs,
  searchJobs,
  getFeaturedJobs,
  advancedJobSearch,
} from "../controllers/job.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Recruiter / Admin Routes
|--------------------------------------------------------------------------
*/
/**
 * @swagger
 * /api/job/create-job:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Job created successfully
 */
router.post("/create-job",authUser,authorizeRoles("recruiter", "admin"),createJob);

router.get("/my-jobs",authUser,authorizeRoles("recruiter", "admin"),getMyJobs);

router.put("/update-job/:id",authUser,authorizeRoles("recruiter", "admin"),updateJob);

router.delete("/delete-job/:id",authUser,authorizeRoles("recruiter", "admin"),deleteJob);

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
/**
 * @swagger
 * /api/job/jobs:
 *   get:
 *     summary: Get all published jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Jobs fetched successfully
 */
router.get("/jobs", getAllJobs);

router.get("/job/:id", getJobById);

router.get("/featured-jobs", getFeaturedJobs);

router.get("/search", searchJobs);

/**
 * @swagger
 * /api/job/advanced-search:
 *   get:
 *     summary: Advanced job search
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Jobs filtered successfully
 */
router.get("/advanced-search",advancedJobSearch);

export default router;