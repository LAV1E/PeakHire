import express from "express";

import {getCandidateDashboard,getRecruiterDashboard,getAdminDashboard,} from "../controllers/dashboard.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Candidate Dashboard
router.get("/candidate",authUser,authorizeRoles("candidate",),getCandidateDashboard);

// Recruiter Dashboard
router.get("/recruiter",authUser,authorizeRoles("recruiter","admin"),getRecruiterDashboard);

// Admin Dashboard
router.get("/admin", authUser,authorizeRoles("admin"),getAdminDashboard);

export default router;