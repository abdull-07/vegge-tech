import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, axios, user, addToCart, navigate } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ totalReviews: 0, averageRating: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [reviewForm, setReviewForm] = useState({ 
    name: user ? user.name : '', 
    rating: 5, 
    comment: '' 
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch reviews when product changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (id) {
        try {
          const { data } = await axios.get(`/api/reviews/${id}`);
          if (data.success && data.reviews) {
            setReviews(data.reviews);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    const fetchReviewStats = async () => {
      if (id) {
        try {
          const { data } = await axios.get(`/api/reviews/${id}/stats`);
          if (data.success && data.stats) {
            setReviewStats(data.stats);
          }
        } catch (error) {
          console.error("Error fetching review stats:", error);
        }
      }
    };

    fetchReviews();
    fetchReviewStats();
  }, [id, axios]);

  // Find product from all categories
  useEffect(() => {
    if (products && id) {
      const allProducts = [
        ...(products.fruits || []),
        ...(products.vegetables || []),
        ...(products.bundles || [])
      ];
      const foundProduct = allProducts.find((item) => item._id === id);
      setProduct(foundProduct);
      setLoading(false);
    }
  }, [products, id]);

  // Update review form when user changes
  useEffect(() => {
    if (user) {
      setReviewForm(prev => ({
        ...prev,
        name: user.name || ''
      }));
    }
  }, [user]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewForm.name || !reviewForm.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmittingReview(true);
      
      const { data } = await axios.post('/api/reviews', {
        productId: id,
        name: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });

      if (data.success) {
        // Add the new review to the list
        setReviews(prevReviews => [data.review, ...prevReviews]);
        
        // Reset the form
        setReviewForm({ 
          name: user ? user.name : '', 
          rating: 5, 
          comment: '' 
        });
        
        // Refresh review stats
        try {
          const statsResponse = await axios.get(`/api/reviews/${id}/stats`);
          if (statsResponse.data.success) {
            setReviewStats(statsResponse.data.stats);
          }
        } catch (error) {
          console.error("Error refreshing review stats:", error);
        }
        
        toast.success("Review submitted successfully");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle quantity changes
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  // Add to cart with quantity
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product._id);
    }
    toast.success(`${quantity} item(s) added to cart`);
  };

  // Buy now with quantity
  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product._id);
    }
    navigate("/cart");
  };

  // Get related products
  const getRelatedProducts = () => {
    if (!product || !products) return [];

    const allProducts = [
      ...(products.fruits || []),
      ...(products.vegetables || []),
      ...(products.bundles || [])
    ];

    return allProducts
      .filter((item) => item.category === product.category && item._id !== product._id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  };

  const relatedProducts = getRelatedProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/all-products')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
        >
          Browse All Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-primary">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/all-products')} className="hover:text-primary">Products</button>
          <span>/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {product.category}
                  </span>
                  {product.isDeal && (
                    <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                      🔥 Deal
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array(5).fill('').map((_, i) => (
                      <svg key={i} className="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                          fill={i < (product.ratings || product.rating || 0) ? 'var(--primary)' : '#e5e7eb'}
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.ratings || product.rating || 0})</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-primary">Rs. {product.offerPrice}</span>
                  {product.price !== product.offerPrice && (
                    <span className="text-lg text-gray-500 line-through">Rs. {product.price}</span>
                  )}
                  {product.price !== product.offerPrice && (
                    <span className="px-2 py-1 bg-green-100 text-green-600 text-sm font-medium rounded">
                      Save Rs. {product.price - product.offerPrice}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">(inclusive of all taxes)</p>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <div className="text-gray-600 space-y-2">
                    {Array.isArray(product.description) ? (
                      product.description.map((desc, index) => (
                        <p key={index}>{desc}</p>
                      ))
                    ) : (
                      <p>{product.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Total: Rs. {(product.offerPrice * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.inStock ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
                      </svg>
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-3 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>60 min delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Fresh guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

          {/* Review Stats */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Ratings</h3>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {Array(5).fill('').map((_, i) => (
                      <svg key={i} className="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                          fill={i < reviewStats.averageRating ? 'var(--primary)' : '#e5e7eb'}
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{reviewStats.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({reviewStats.totalReviews} reviews)</span>
                </div>
              </div>
              
              {reviewStats.ratingDistribution && (
                <div className="mt-4 md:mt-0 w-full md:w-1/2 max-w-xs">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = reviewStats.ratingDistribution[star] || 0;
                    const percentage = reviewStats.totalReviews > 0 
                      ? Math.round((count / reviewStats.totalReviews) * 100) 
                      : 0;
                    
                    return (
                      <div key={star} className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1 w-12">
                          <span>{star}</span>
                          <svg className="w-4 h-4" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="var(--primary)" />
                          </svg>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Add Review Form */}
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div>
            {reviews.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold">
                            {review.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.name}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                          {review.isVerified && (
                            <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Verified Purchase
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array(5).fill('').map((_, i) => (
                          <svg key={i} className="w-4 h-4" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                              fill={i < review.rating ? 'var(--primary)' : '#e5e7eb'}
                            />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;