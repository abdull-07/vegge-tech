import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const Deals = ({ limit = 4, showViewAll = true }) => {
  const { products } = useAppContext();

  // Filter bundles with inStock true
  const dealBundles = (products.bundles || []).filter(product => product.inStock);
  
  // Limit to specified number of bundles for homepage
  const limitedBundles = dealBundles.slice(0, limit);

  return (
    <section className="px-4 md:px-16 py-12 bg-background-dark">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text">🎉 Deals & Offers</h2>
        <p className="text-text-light mt-2">Save more with our combo packs and bundles!</p>
      </div>

      {dealBundles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {limitedBundles.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {showViewAll && dealBundles.length > limit && (
            <div className="text-center mt-8">
              <Link 
                to="/deals-offers" 
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                View All Bundles
              </Link>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-text-light">No deals available on bundles currently.</p>
      )}
    </section>
  );
};

export default Deals;