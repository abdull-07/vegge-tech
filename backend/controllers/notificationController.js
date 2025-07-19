import Notification from "../models/NotificationModel.js";
import User from "../models/UserModel.js";
import { sendNewOrderNotificationEmail } from "../utils/emailService.js";

// Create a new notification and send email for the admin seller
export const createOrderNotification = async (orderData) => {
    try {
        // Get customer information
        const customer = await User.findById(orderData.userId);
        if (!customer) {
            console.error("Customer not found:", orderData.userId);
            return;
        }

        // Generate order number if not provided
        const orderNumber = orderData.orderNumber || `ORD${Date.now()}`;

        // Use admin seller info from environment variables
        const adminSellerId = "admin"; // Static ID for the single admin seller
        const adminSellerEmail = process.env.ADMIN_EMAIL;
        const adminSellerName = "Admin"; // You can change this to a more specific name

        // Create notification in database
        const notification = await Notification.create({
            sellerId: adminSellerId, // Using static admin ID
            orderId: orderData._id,
            type: 'new_order',
            title: `New Order Received - ${orderNumber}`,
            message: `You have received a new order from ${customer.name} worth Rs. ${orderData.amount}`,
            customerInfo: {
                name: customer.name,
                email: customer.email,
                phone: orderData.address.phoneNumber
            },
            orderDetails: {
                orderNumber: orderNumber,
                totalAmount: orderData.amount,
                itemCount: orderData.items.length,
                paymentMethod: orderData.paymentType
            }
        });

        console.log("Notification created:", notification._id);

        // Prepare email data
        const emailOrderDetails = {
            orderNumber: orderNumber,
            customerInfo: {
                name: customer.name,
                email: customer.email,
                phone: orderData.address.phoneNumber
            },
            items: orderData.items,
            totalAmount: orderData.amount,
            paymentMethod: orderData.paymentType,
            address: orderData.address
        };

        // Send email notification to admin
        try {
            await sendNewOrderNotificationEmail(adminSellerEmail, adminSellerName, emailOrderDetails);
            
            // Update notification to mark email as sent
            notification.isEmailSent = true;
            notification.emailSentAt = new Date();
            await notification.save();
            
            console.log("Email notification sent successfully to admin:", adminSellerEmail);
        } catch (emailError) {
            console.error("Failed to send email notification:", emailError);
            // Don't throw error - notification is still created even if email fails
        }

        return notification;
    } catch (error) {
        console.error("Error creating order notification:", error);
        throw error;
    }
};

// Get notifications for the admin seller
// GET /api/notifications
export const getSellerNotifications = async (req, res) => {
    try {
        const sellerId = "admin"; // Static admin seller ID
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const query = { sellerId };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .populate('orderId', 'amount paymentType status createdAt')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalNotifications = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({ sellerId, isRead: false });

        res.status(200).json({
            notifications,
            totalNotifications,
            unreadCount,
            currentPage: page,
            totalPages: Math.ceil(totalNotifications / limit)
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Failed to fetch notifications" });
    }
};

// Mark notification as read
// PUT /api/notifications/:id/read
export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = "admin"; // Static admin seller ID

        const notification = await Notification.findOneAndUpdate(
            { _id: id, sellerId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ message: "Failed to update notification" });
    }
};

// Mark all notifications as read
// PUT /api/notifications/read-all
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const sellerId = "admin"; // Static admin seller ID

        await Notification.updateMany(
            { sellerId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ message: "Failed to update notifications" });
    }
};

// Delete notification
// DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = "admin"; // Static admin seller ID

        const notification = await Notification.findOneAndDelete({ _id: id, sellerId });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).json({ message: "Failed to delete notification" });
    }
};