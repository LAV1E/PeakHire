import express from "express";

import {
  getAdminDashboard,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getPendingCompanies,
  approveCompany,
  deleteCompany,
  getPlatformAnalytics,
} from "../controllers/admin.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();


router.use(authUser,authorizeRoles("admin"));
router.get("/dashboard",getAdminDashboard);
router.get("/users", getAllUsers);
router.patch("/block-user/:id",blockUser);
router.patch("/unblock-user/:id",unblockUser);
router.delete("/delete-user/:id",deleteUser);
router.get("/pending-companies",getPendingCompanies);
router.patch("/approve-company/:id",approveCompany);
router.delete("/delete-company/:id",deleteCompany);
router.get("/platform-analytics",getPlatformAnalytics);

export default router;