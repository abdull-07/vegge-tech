import React from "react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";  

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateCart, removeProductFromCart, navigate } = useAppContext();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity === 0) {
      removeProductFromCart(product._id);
    } else {
      updateCart(product._id, newQuantity);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md px-4 py-3 bg-background w-full">
      <div className="relative group cursor-pointer flex items-center justify-center">
        {/* Category Label */}
        <span className={`absolute top-2 right-2 text-white text-xs px-3 py-1 rounded-full font-semibold z-10 ${
          product.category.toLowerCase() === 'fruits' || product.category.toLowerCase() === 'fruit' 
            ? 'bg-orange-500' 
            : product.category.toLowerCase() === 'vegetables' || product.category.toLowerCase() === 'vegetable'
            ? 'bg-green-500'
            : product.category.toLowerCase() === 'bundles' || product.category.toLowerCase() === 'bundle'
            ? 'bg-red-500'
            : 'bg-gray-500'
        }`}>
          {product.category.toUpperCase()}
        </span>
        
        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold z-10">
            Out of Stock
          </span>
        )}
        <Link to={`/product/${product._id}`}>
          <img
            className="group-hover:scale-105 transition max-w-36"
            src={product.imageUrl}
            alt={product.name}
          />
        </Link>
      </div>
      <div className="text-text-light text-sm mt-2">
        <p>{product.category}</p>
        <p className="text-text font-medium text-lg truncate">{product.name}</p>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mt-1">
          {Array(5)
            .fill('')
            .map((_, i) => (
              i < product.rating ? (
                <svg key={i} className="w-4 h-4" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="var(--primary)" />
                </svg>
              ) : (
                <svg key={i} className="w-4 h-4" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="var(--primary)" fillOpacity="0.3" />
                </svg>
              )
            ))}
          <p className="text-xs">({product.rating})</p>
        </div>

        {/* Pricing + Button */}
        <div className="flex items-end justify-between mt-3">
          <p className="text-primary text-base font-semibold">
            Rs. {product.offerPrice}
            <span className="text-text-light text-xs line-through ml-2">
              Rs. {product.price}
            </span>
          </p>

          <div className="text-primary">
            {!product.inStock ? (
              <button
                disabled
                className="bg-gray-300 text-gray-600 w-[85px] h-[34px] rounded text-sm font-medium cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : !cartItems[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary w-[70px] h-[34px] rounded text-primary text-sm font-medium"
              >
                {product.category === "Bundle" ? "Buy" : "Add"}
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-[70px] h-[34px] bg-primary/10 rounded">
                <button onClick={() => handleQuantityChange(cartItems[product._id] - 1)}>-</button>
                <span>{cartItems[product._id]}</span>
                <button onClick={() => handleQuantityChange(cartItems[product._id] + 1)}>+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
