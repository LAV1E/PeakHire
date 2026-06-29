import express from "express";

import {getMyNotifications,getUnreadCount,markNotificationAsRead,markAllNotificationsAsRead,deleteNotification,deleteAllNotifications,} from "../controllers/notfication.controller.js";

import { authUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// Notification Routes
// =====================================================

// Get all notifications
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */
router.get("/",authUser,getMyNotifications);

// Get unread count

router.get("/unread-count",authUser,getUnreadCount);

// Mark one notification as read
/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch("/:id/read",authUser,markNotificationAsRead);

// Mark all notifications as read

router.patch( "/read-all",authUser,markAllNotificationsAsRead);

// Delete one notification

router.delete("/:id",authUser,deleteNotification);

// Delete all notifications

router.delete("/",authUser,deleteAllNotifications);

export default router;