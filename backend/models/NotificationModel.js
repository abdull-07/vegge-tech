import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sellerId: { 
        type: String, 
        required: true,
        default: "admin" // For single admin seller setup
    },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order", 
        required: true 
    },
    type: {
        type: String,
        enum: ['new_order', 'order_update', 'payment_received'],
        default: 'new_order'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    orderDetails: {
        orderNumber: { type: String },
        totalAmount: { type: Number, required: true },
        itemCount: { type: Number, required: true },
        paymentMethod: { type: String, required: true }
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isEmailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: {
        type: Date
    }
}, { 
    timestamps: true 
});

// Index for faster queries
notificationSchema.index({ sellerId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;