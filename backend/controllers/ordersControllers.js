import Order from "../models/OrdersModel.js";
import Product from "../models/Products.js";

// /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid Data" });
        }

        // Calculate total amount
        const productAmount = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.product);
                return product.offerPrice * item.quantity;
            })
        );

        let amount = productAmount.reduce((sum, val) => sum + val, 0);

        // Add 5% tax
        amount += Math.floor(amount * 0.05);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Cash On Delivery",
            isPaid: false,
        });

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
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "Cash On Delivery" }, { isPaid: false }],
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

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
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error in getting all orders:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};