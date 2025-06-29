// src/pages/ProductDetails.jsx
import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import { productsData } from '../assets/productsdata';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const allProducts = [...productsData.fruits, ...productsData.vegetables];
  const product = allProducts.find((item) => item._id === id);
  const { reviews, setReviews, reviewForm, setReviewForm, addToCart, navigate } = useAppContext();


  const handleReviewSubmit = (e) => {
  e.preventDefault();

  if (!reviewForm.name || !reviewForm.comment) {
    alert("Please fill in all fields");
    return;
  }

  const newReview = {
    name: reviewForm.name,
    rating: reviewForm.rating,
    comment: reviewForm.comment,
    date: new Date().toLocaleDateString()
  };

  setReviews((prevReviews) => [newReview, ...prevReviews]);
  setReviewForm({ name: '', rating: 5, comment: '' });
  toast.success("Review submitted successfully");
};


  const relatedProducts = allProducts
    .filter((item) => item.category === product.category && item._id !== product._id)
    .sort(()=>Math.random()- 0.5)
    .slice(0, 4); // only show 4

  if (!product) return <p className="text-center py-10">Product not found</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-text">
      <div className="flex flex-col md:flex-row gap-10 bg-background-dark p-6 rounded-lg">
        
        <div className="w-full md:w-1/2 border border-gray-300 p-4 rounded bg-background">
          <img src={product.image} alt={product.name} className="w-full rounded" />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {Array(5).fill('').map((_, i) => (
              <svg key={i} className="w-5 h-5" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                  fill={i < product.rating ? 'var(--primary)' : 'var(--primary-opacity)'}
                />
              </svg>
            ))}
            <p className="text-sm ml-2">({product.rating})</p>
          </div>

          {/* Price */}
          <div className="mt-4">
            <p className="text-lg font-bold text-primary">Rs. {product.offerPrice}</p>
            <p className="text-sm text-text-light line-through">Rs. {product.price}</p>
            <p className="text-xs text-text-light mt-1">(inclusive of all taxes)</p>
          </div>

          {/* Description */}
          <p className="mt-6 text-sm text-text-light">{product.desc}</p>

          {/* Action */}
          <div className="flex gap-4 mt-6">
            <button onClick={() => addToCart(product._id)} className="w-full py-2 bg-primary text-white rounded hover:bg-primary-hover transition cursor-pointer">Add to Cart</button>
            <button onClick={() => {addToCart(product._id); navigate("/cart")}} className="w-full py-2 bg-background text-primary border border-primary rounded hover:bg-primary-hover hover:text-text transition-colors duration-200 cursor-pointer">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedProducts.map((item) => (
            <ProductCard key={item._id} product={item} />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {/* Add review form and list */}
        <form onSubmit={handleReviewSubmit} className="mb-8">
  <h3 className="text-lg font-semibold mb-2">Write a review</h3>
  <input
    type="text"
    value={reviewForm.name}
    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
    placeholder="Your name"
    className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
    required
  />
  <select
    value={reviewForm.rating}
    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
    className="w-full p-2 border border-gray-300 rounded mb-2 text-sm"
  >
    {[5, 4, 3, 2, 1].map((r) => (
      <option key={r} value={r}>{r} Star{r !== 1 && 's'}</option>
    ))}
  </select>
  <textarea
    value={reviewForm.comment}
    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
    placeholder="Your review"
    rows={3}
    className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
    required
  />
  <button
    type="submit"
    className="bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded text-sm"
  >
    Submit Review
  </button>
</form>
{/* Review List */}
<div>
  {reviews.length === 0 ? (
    <p className="text-sm text-text-light">No reviews yet.</p>
  ) : (
    <ul className="space-y-4">
      {reviews.map((rev) => (
        <li key={rev.id} className="border border-gray-200 p-4 rounded bg-white text-sm">
          <div className="flex items-center justify-between">
            <p className="font-medium">{rev.name}</p>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z"
                    fill={i < rev.rating ? 'var(--primary)' : 'var(--primary-opacity)'}
                  />
                </svg>
              ))}
            </div>
          </div>
          <p className="mt-2 text-text-light">{rev.comment}</p>
        </li>
      ))}
    </ul>
  )}
</div>
      </div>
    </div>
  );
};

export default ProductDetails;