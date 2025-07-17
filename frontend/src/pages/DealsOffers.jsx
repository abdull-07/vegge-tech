import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const DealsOffers = () => {
  const { products } = useAppContext();

  // Filter all bundles with inStock true
  const allBundles = (products.bundles || []).filter(product => product.inStock);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-16 py-12">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            🎉 Deals & Offers
          </h1>
          <p className="text-text-light text-lg">
            Discover all our amazing combo packs and bundles with great savings!
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>

        {/* Bundles Grid */}
        {allBundles.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-text-light text-center">
                Showing {allBundles.length} bundle{allBundles.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {allBundles.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-text mb-2">
              No Bundles Available
            </h3>
            <p className="text-text-light">
              We're working on bringing you amazing bundle deals. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsOffers;