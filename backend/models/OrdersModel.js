import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        streetAddress: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    status: { type: String, default: 'Order Placed' },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    paymentId: { type: String },          // e.g., Razorpay/Stripe transaction ID
    paymentStatus: { type: String },      // e.g., "success", "failed"
    paidAt: { type: Date }                // When the order was marked as paid


}, { timestamps: true })

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)
export default Order