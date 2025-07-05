import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    stock: { type: Boolean, required: true, default: 0 },
    imageUrl: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    isAvailable: { type: Boolean, default: true }

}, { timestamps: true })

const Product = mongoose.models.product || mongoose.model('Product', productSchema)

export default Product