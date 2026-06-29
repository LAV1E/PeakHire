import express from "express";

import {createOffer,getRecruiterOffers,getCandidateOffers,  getOfferById,acceptOffer,rejectOffer,deleteOffer,} from "../controllers/offer.controller.js";

import { authUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

// Recruiter
/**
 * @swagger
 * /api/offers/create-offer:
 *   post:
 *     summary: Create an offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Offer created successfully
 */
router.post("/create-offer",authUser,authorizeRoles("recruiter","admin"),createOffer);

router.get("/get-Recruiter-Offers",authUser,authorizeRoles("recruiter","admin"),getRecruiterOffers);

router.delete("/delete-offer/:id",authUser,authorizeRoles("recruiter","admin"),deleteOffer);

// Candidate
/**
 * @swagger
 * /api/offers/get-offer:
 *   get:
 *     summary: Get candidate offers
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers fetched successfully
 */
router.get("/get-offer",authUser,authorizeRoles("candidate", "admin"),getCandidateOffers);

router.patch("/accept-offer/:id",authUser,authorizeRoles("candidate","admin"),acceptOffer);

router.patch("/:id/reject-offer", authUser,authorizeRoles("candidate","admin"),rejectOffer);

// Common

router.get("get-Offer-ById/:id",authUser,authorizeRoles("candidate","recruiter","admin"),getOfferById);

export default router;