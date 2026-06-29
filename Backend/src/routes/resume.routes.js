import express from "express";

import {
  uploadResume,
  getMyResume,
  deleteResume,
} from "../controllers/resume.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import {
  uploadResume as resumeUpload,
} from "../middleware/multer.middleware.js";

const router = express.Router();

// Upload / Replace Resume
router.post(
  "/upload-resume",
  authUser,
  resumeUpload.single("resume"),
  uploadResume
);

// Get Resume
router.get(
  "/my-resume",
  authUser,
  getMyResume
);

// Delete Resume
router.delete(
  "/delete-resume",
  authUser,
  deleteResume
);

export default router;