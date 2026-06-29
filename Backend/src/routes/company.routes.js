import express from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles,} from "../middleware/role.middleware.js";
import {
  createCompany,
  getMyCompany,
  updateCompany,
  deleteCompany,
  verifyCompany,
  getPendingCompanies,
} from "../controllers/company.controller.js";



const router = express.Router();


//recruiter
router.post( "/create-company",authUser, authorizeRoles("recruiter","admin"),createCompany);

/**
 * @swagger
 * /api/company/create-company:
 *   post:
 *     summary: Create a company
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Company created successfully
 */
router.get("/getMyCompany",authUser,authorizeRoles("recruiter","admin" ),getMyCompany);

router.put("/update-Company/:id",authUser,authorizeRoles("recruiter","admin"),updateCompany);

router.delete("/delete-company/:id",authUser,authorizeRoles( "recruiter", "admin"),deleteCompany);


// admin
/**
 * @swagger
 * /api/company/verify-company/{id}:
 *   patch:
 *     summary: Verify a company (Admin)
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company verified successfully
 */
router.patch("/verify-company/:id",authUser,authorizeRoles("admin"),verifyCompany,);

router.get("/pending-companies",authUser,authorizeRoles("admin"),getPendingCompanies,);

export default router;