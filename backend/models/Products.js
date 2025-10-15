import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: [String], required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: 1 },
    imageUrl: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.Mixed, ref: 'Seller', required: false }, // Allow both ObjectId and String
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    isAvailable: { type: Boolean, default: true },
    isDeal: { type: Boolean, default: false } // Add this 


}, { timestamps: true })

const Product = mongoose.models.product || mongoose.model('Product', productSchema)

export default Product