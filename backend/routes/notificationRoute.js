import express from "express";
import {
    getSellerNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../controllers/notificationController.js";
import sellerAuth from "../middlewares/sellerAuth.js";

const router = express.Router();

// Get seller notifications
router.get('/', sellerAuth, getSellerNotifications);

// Mark notification as read
router.put('/:id/read', sellerAuth, markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', sellerAuth, markAllNotificationsAsRead);

// Delete notification
router.delete('/:id', sellerAuth, deleteNotification);

export default router;