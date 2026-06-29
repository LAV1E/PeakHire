import express from "express";

import {uploadAvatar,getMyProfile,updateProfile,getPublicProfile,} from "../controllers/profile.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { uploadAvatar as avatarUpload } from "../middleware/multer.middleware.js";

const router = express.Router();

// ==========================================
// Candidate Routes
// ==========================================

// Upload / Replace Avatar
router.post("/upload-avatar",authUser,avatarUpload.single("avatar"),uploadAvatar);

// Get Logged In User Profile
router.get("/me",authUser,getMyProfile);

// Update Profile
router.put("/update",authUser,updateProfile);

// ==========================================
// Public Profile
// ==========================================

// View Candidate Profile
router.get("/:userId",authUser,getPublicProfile);

export default router;