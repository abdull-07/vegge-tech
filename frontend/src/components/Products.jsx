import React from 'react';
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products, seacrhQuery } = useAppContext();

  const query = seacrhQuery?.toLowerCase().trim();

  // Combine all products
  const allProducts = [
    ...(products.fruits || []),
    ...(products.vegetables || [])
  ];

  // Filter matching products by name or category
  const filteredProducts = query
    ? allProducts.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">All Products</h2>

      {query && (
        <>
          <h3 className="text-xl font-medium mb-2">Search Results for: <span className="text-primary">{seacrhQuery}</span></h3>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-light">No products found for your search.</p>
          )}
        </>
      )}

      {!query && (
        <>
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 mt-6 sm:mt-8">🍎 Fruits</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {fruits.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 mt-10 sm:mt-12">🥕 Vegetables</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {vegetables.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;