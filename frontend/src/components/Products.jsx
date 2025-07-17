import React from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products, seacrhQuery } = useAppContext();

  /* ───────── derive category arrays ───────── */
  const fruits = (products.fruits || []).filter(product => product.inStock);
  const vegetables = (products.vegetables || []).filter(product => product.inStock);
  const bundles = (products.bundles || []).filter(product => product.inStock);

  /* ───────── combine for searching ───────── */
  const allProducts = [...fruits, ...vegetables, ...bundles];

  const query = seacrhQuery?.toLowerCase().trim() || "";

  const filteredProducts = query
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : [];

  /* ───────── UI ───────── */
  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        All Products
      </h2>

      {query ? (
        /* ---------- search view ---------- */
        <>
          <h3 className="text-xl font-medium mb-4">
            Search results for&nbsp;
            <span className="text-primary">{seacrhQuery}</span>
          </h3>

          {filteredProducts.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-text-light">
              No products match your search.
            </p>
          )}
        </>
      ) : (
        /* ---------- default category view ---------- */
        <>
          {/* Fruits */}
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">🍎 Fruits</h3>
          {fruits.length ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {fruits.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="mb-8 text-text-light">No fruits available.</p>
          )}

          {/* Vegetables */}
          <h3 className="text-xl sm:text-2xl font-semibold mt-10 mb-4">
            🥕 Vegetables
          </h3>
          {vegetables.length ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {vegetables.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-text-light">No vegetables available.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
