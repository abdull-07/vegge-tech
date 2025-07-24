import Review from '../models/ReviewModel.js';
import Product from '../models/Products.js';

// Get all reviews for a product
// GET /api/reviews/:productId
export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const reviews = await Review.find({ productId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email', null, { strictPopulate: false });

        return res.status(200).json({
            success: true,
            reviews: reviews.map(review => ({
                _id: review._id,
                name: review.name,
                rating: review.rating,
                comment: review.comment,
                isVerified: review.isVerified,
                date: review.createdAt.toLocaleDateString(),
                createdAt: review.createdAt
            }))
        });
    } catch (error) {
        console.error("Get reviews error:", error.message);
        return res.status(500).json({ message: "Failed to fetch reviews" });
    }
};

// Add a new review
// POST /api/reviews
export const addReview = async (req, res) => {
    try {
        const { productId, name, rating, comment } = req.body;

        // Validation
        if (!productId || !name || !rating || !comment) {
            return res.status(400).json({ 
                message: "Product ID, name, rating, and comment are required" 
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                message: "Rating must be between 1 and 5" 
            });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Create new review
        const newReview = new Review({
            productId,
            name: name.trim(),
            rating: parseInt(rating),
            comment: comment.trim(),
            userId: req.userId || null // If user is logged in
        });

        await newReview.save();

        // Update product's average rating
        await updateProductRating(productId);

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: {
                _id: newReview._id,
                name: newReview.name,
                rating: newReview.rating,
                comment: newReview.comment,
                isVerified: newReview.isVerified,
                date: newReview.createdAt.toLocaleDateString(),
                createdAt: newReview.createdAt
            }
        });
    } catch (error) {
        console.error("Add review error:", error.message);
        return res.status(500).json({ message: "Failed to add review" });
    }
};

// Update product's average rating
const updateProductRating = async (productId) => {
    try {
        const reviews = await Review.find({ productId });
        
        if (reviews.length === 0) {
            await Product.findByIdAndUpdate(productId, { ratings: 0 });
            return;
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal

        await Product.findByIdAndUpdate(productId, { 
            ratings: averageRating,
            reviewCount: reviews.length 
        });
    } catch (error) {
        console.error("Update product rating error:", error.message);
    }
};

// Delete a review (admin only or review owner)
// DELETE /api/reviews/:reviewId
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const productId = review.productId;
        await Review.findByIdAndDelete(reviewId);

        // Update product's average rating
        await updateProductRating(productId);

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        console.error("Delete review error:", error.message);
        return res.status(500).json({ message: "Failed to delete review" });
    }
};

// Get review statistics for a product
// GET /api/reviews/:productId/stats
export const getReviewStats = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId });
        
        if (reviews.length === 0) {
            return res.status(200).json({
                success: true,
                stats: {
                    totalReviews: 0,
                    averageRating: 0,
                    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                }
            });
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = Math.round((totalRating / reviews.length) * 10) / 10;

        const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            ratingDistribution[review.rating]++;
        });

        return res.status(200).json({
            success: true,
            stats: {
                totalReviews: reviews.length,
                averageRating,
                ratingDistribution
            }
        });
    } catch (error) {
        console.error("Get review stats error:", error.message);
        return res.status(500).json({ message: "Failed to fetch review statistics" });
    }
};