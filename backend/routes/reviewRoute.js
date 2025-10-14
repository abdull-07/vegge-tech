import express from 'express';
import {
    getProductReviews,
    addReview,
    deleteReview,
    getReviewStats
} from '../controllers/reviewController.js';
import userAuth from '../middlewares/userAuth.js';

const router = express.Router();

// Get review statistics for a product (more specific route first)
router.get('/:productId/stats', getReviewStats);

// Get all reviews for a product
router.get('/:productId', getProductReviews);

// Add a new review (optional user auth - allows anonymous reviews)
router.post('/', (req, res, next) => {
    // Try to authenticate user, but don't fail if not authenticated
    userAuth(req, res, (err) => {
        // Continue regardless of auth status
        next();
    });
}, addReview);

// Delete a review (requires authentication)
router.delete('/:reviewId', userAuth, deleteReview);

export default router;