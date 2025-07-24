import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const Deals = ({ limit = 8, showViewAll = true }) => {
  const { products } = useAppContext();

  // Filter bundles with inStock true
  const dealBundles = (products.bundles || []).filter(product => product.inStock);

  // Limit to specified number of bundles for homepage
  const limitedBundles = dealBundles.slice(0, limit);

  return (
    <section className="relative py-20 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-orange-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-yellow-500 rounded-full blur-xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 rounded-full mb-4">
            <span className="text-red-600 font-medium text-sm">🔥 LIMITED TIME OFFERS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Special Deals & Bundles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Save big with our exclusive combo packs and seasonal bundles - fresh quality at unbeatable prices!
          </p>
        </div>

        {dealBundles.length > 0 ? (
          <>
            {/* Products Grid with enhanced animations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
              {limitedBundles.map((product, index) => (
                <div
                  key={product._id}
                  className="group relative transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Deal badge */}
                  {/* <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    DEAL
                  </div> */}
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced View All Button */}
            {showViewAll && dealBundles.length > limit && (
              <div className="text-center">
                <Link
                  to="/deals-offers"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <span>🔥 View All Deals</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}

            {/* Deal Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl mb-3">💰</div>
                <h3 className="font-bold text-gray-900 mb-2">Save Up to 30%</h3>
                <p className="text-sm text-gray-600">Exclusive bundle discounts</p>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl mb-3">📦</div>
                <h3 className="font-bold text-gray-900 mb-2">Combo Packs</h3>
                <p className="text-sm text-gray-600">Perfectly paired products</p>
              </div>
              <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="text-3xl mb-3">⏰</div>
                <h3 className="font-bold text-gray-900 mb-2">Limited Time</h3>
                <p className="text-sm text-gray-600">Don't miss out on savings</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔥</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Amazing Deals Coming Soon!</h3>
            <p className="text-gray-600 text-lg mb-8">We're preparing some incredible bundle offers for you</p>
            <Link
              to="/all-products"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary transition-colors"
            >
              <span>Browse Products</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Deals;