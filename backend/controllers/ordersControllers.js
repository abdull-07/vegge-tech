import Order from "../models/OrdersModel.js";
import Product from "../models/Products.js";
import mongoose from "mongoose";
import { createOrderNotification } from "./notificationController.js";

// /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        // console.log("Order placement request:", { userId, items, address });

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid Data" });
        }
        
        // Check if user's email is verified
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prevent unverified users from placing orders
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Please verify your email before placing an order",
                verificationRequired: true
            });
        }

        // Calculate subtotal
        const productAmounts = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Product not found: ${item.product}`);
                }
                return product.offerPrice * item.quantity;
            })
        );

        const subtotal = productAmounts.reduce((sum, val) => sum + val, 0);
        
        // Calculate fees (matching frontend calculation)
        const deliveryFee = 30; // COD delivery fee
        const tax = Math.floor(subtotal * 0.05); // 5% tax
        const totalAmount = subtotal + deliveryFee + tax;

        // console.log("Order calculation:", { subtotal, deliveryFee, tax, totalAmount });  

        const newOrder = await Order.create({
            userId,
            items,
            amount: totalAmount,
            address,
            paymentType: "Cash On Delivery",
            isPaid: false,
        });

        // console.log("Order created successfully:", newOrder._id);

        // Create notification for the admin seller
        try {
            await createOrderNotification(newOrder);
            // console.log("Notification created for admin seller");
        } catch (notificationError) {
            console.error("Failed to create notification:", notificationError);
            // Don't fail the order if notification fails
        }

        res.status(200).json({ message: "Order Placed Successfully" });
    } catch (error) {
        console.error("Error in placing order:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// /api/order/online
export const placeOrderOnline = async (req, res) => {
    try {
        const userId = req.userId
        const { items, address, paymentId, amount } = req.body;

        if (!items || items.length === 0 || !address || !paymentId) {
            return res.status(400).json({ message: "Missing order info" });
        }
        
        // Check if user's email is verified
        const User = mongoose.model('User');
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Prevent unverified users from placing orders
        if (!user.isVerified) {
            return res.status(403).json({ 
                message: "Please verify your email before placing an order",
                verificationRequired: true
            });
        }

        // (Optional) Verify paymentId from payment gateway here

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            isPaid: true,
        });

        res.status(200).json({ message: "Order placed via Online Payment" });

    } catch (error) {
        console.error("Error in Updating Cart:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// /api/order/user
export const getUserOrder = async (req, res) => {
    try {
        const userId = req.userId;
        // console.log("Fetching orders for user:", userId);
        
        const orders = await Order.find({ userId })
            .populate("items.product")
            .sort({ createdAt: -1 });

        // console.log("Found orders:", orders.length);
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error in getting user orders:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// /api/order/seller
export const getSellerOrder = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "Cash On Delivery" }, { isPaid: true }],
        })
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error in getting all orders:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// /api/order/mark-paid/:orderId
export const markOrderAsPaid = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        // Find and update the order
        const order = await Order.findByIdAndUpdate(
            orderId,
            { 
                isPaid: true,
                paymentStatus: "success",
                paidAt: new Date()
            },
            { new: true }
        ).populate("items.product");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        console.log(`Order ${orderId} marked as paid`);
        res.status(200).json({ 
            message: "Order marked as paid successfully",
            order 
        });
    } catch (error) {
        console.error("Error marking order as paid:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};