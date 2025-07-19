import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { products, seacrhQuery, setSeacrhQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [loading, setLoading] = useState(true);

  // Get all products from different categories
  const getAllProducts = () => {
    const allProducts = [
      ...(products.fruits || []),
      ...(products.vegetables || []),
      ...(products.bundles || [])
    ];
    return allProducts;
  };

  // Filter and sort products
  useEffect(() => {
    let allProducts = getAllProducts();
    
    if (allProducts.length === 0) {
      setLoading(true);
      return;
    }
    
    setLoading(false);

    // Filter by search query
    if (seacrhQuery) {
      allProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(seacrhQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(seacrhQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      allProducts = allProducts.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-500":
          allProducts = allProducts.filter(product => product.offerPrice < 500);
          break;
        case "500-1000":
          allProducts = allProducts.filter(product => product.offerPrice >= 500 && product.offerPrice < 1000);
          break;
        case "1000-2000":
          allProducts = allProducts.filter(product => product.offerPrice >= 1000 && product.offerPrice < 2000);
          break;
        case "above-2000":
          allProducts = allProducts.filter(product => product.offerPrice >= 2000);
          break;
        default:
          break;
      }
    }

    // Sort products
    switch (sortBy) {
      case "name":
        allProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-low":
        allProducts.sort((a, b) => a.offerPrice - b.offerPrice);
        break;
      case "price-high":
        allProducts.sort((a, b) => b.offerPrice - a.offerPrice);
        break;
      case "rating":
        allProducts.sort((a, b) => (b.ratings || b.rating || 0) - (a.ratings || a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(allProducts);
  }, [products, seacrhQuery, selectedCategory, sortBy, priceRange]);

  // Get product categories
  const getCategories = () => {
    const allProducts = getAllProducts();
    const categories = [...new Set(allProducts.map(product => product.category))];
    return categories;
  };

  const categories = getCategories();

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("all");
    setSortBy("name");
    setPriceRange("all");
    setSeacrhQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Fresh Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our wide selection of fresh fruits, vegetables, and special bundles. 
            Quality guaranteed with 60-minute delivery.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={seacrhQuery}
                  onChange={(e) => setSeacrhQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Prices" },
                { value: "under-500", label: "Under Rs. 500" },
                { value: "500-1000", label: "Rs. 500 - 1000" },
                { value: "1000-2000", label: "Rs. 1000 - 2000" },
                { value: "above-2000", label: "Above Rs. 2000" }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setPriceRange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    priceRange === range.value
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters & Clear */}
          {(selectedCategory !== "all" || sortBy !== "name" || priceRange !== "all" || seacrhQuery) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Active filters:</span>
                {selectedCategory !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                    {selectedCategory}
                  </span>
                )}
                {priceRange !== "all" && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                    {priceRange.replace("-", " - Rs. ")}
                  </span>
                )}
                {seacrhQuery && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                    "{seacrhQuery}"
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredProducts.length}</span> products
            {seacrhQuery && (
              <span> for "<span className="font-semibold">{seacrhQuery}</span>"</span>
            )}
          </p>
          
          {/* View Toggle (could be added later) */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">View:</span>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button className="px-3 py-1 bg-primary text-white text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {seacrhQuery 
                ? `No products match your search "${seacrhQuery}"`
                : "No products match your current filters"
              }
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing all {filteredProducts.length} products
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
