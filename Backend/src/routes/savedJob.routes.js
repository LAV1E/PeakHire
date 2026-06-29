import express from "express";

import {
  saveJob,
  getSavedJobs,
  removeSavedJob,
  checkSavedJob,
} from "../controllers/savedJob.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Save Job
router.post(
  "/:jobId",
  authUser,
  authorizeRoles("candidate"),
  saveJob
);

// Get My Saved Jobs
router.get(
  "/",
  authUser,
  authorizeRoles("candidate"),
  getSavedJobs
);

// Remove Saved Job
router.delete(
  "/:jobId",
  authUser,
  authorizeRoles("candidate"),
  removeSavedJob
);

// Check Saved Status
router.get(
  "/check/:jobId",
  authUser,
  authorizeRoles("candidate"),
  checkSavedJob
);

export default router;