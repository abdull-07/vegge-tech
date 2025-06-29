import React from "react";
import {productsData} from "../assets/productsdata.js"; // Adjust the path as necessary
import ProductCard from "./ProductCard"; // Make sure the path is correct

const Deals = () => {
  // Get all bundle products marked as deals
  const dealBundles = productsData.deals.filter(item => item.isDeal);

  return (
    <section className="px-4 md:px-16 py-12 bg-background-dark">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-text">🎉 Deals & Offers</h2>
        <p className="text-text-light mt-2">Save more with our combo packs and bundles!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {dealBundles.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Deals;
