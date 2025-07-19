import { useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("fruits");
  const { products } = useAppContext();

  // Filter products by inStock: true and then by activeTab
  const filteredProducts = (products[activeTab] || []).filter(product => product.inStock);
  const productsToDisplay = filteredProducts.slice(0, 8);

  const tabConfig = {
    fruits: { icon: "🍎", label: "Fresh Fruits", color: "from-red-500 to-orange-500" },
    vegetables: { icon: "🥬", label: "Fresh Vegetables", color: "from-green-500 to-emerald-500" }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          🌱 Fresh Categories
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our carefully curated selection of premium fresh produce
        </p>
      </div>

      {/* Enhanced Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-2 rounded-2xl shadow-inner">
          <div className="flex gap-2">
            {["fruits", "vegetables"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <span className="text-xl">{tabConfig[tab].icon}</span>
                <span className="capitalize font-medium">{tabConfig[tab].label}</span>
                {activeTab === tab && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tabConfig[tab].color} opacity-10 rounded-xl`}></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid with enhanced styling */}
      <div className="relative">
        {productsToDisplay.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {productsToDisplay.map((product, index) => (
                <div
                  key={product._id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Link
                to="/all-products"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>View All {tabConfig[activeTab].label}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">{tabConfig[activeTab].icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No {activeTab} available</h3>
            <p className="text-gray-600">Check back soon for fresh {activeTab}!</p>
          </div>
        )}
      </div>

      {/* Category Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
          <div className="text-3xl mb-3">🚚</div>
          <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
          <p className="text-sm text-gray-600">Fresh produce delivered in 60 minutes</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
          <div className="text-3xl mb-3">🌱</div>
          <h3 className="font-semibold text-gray-900 mb-2">Farm Fresh</h3>
          <p className="text-sm text-gray-600">Directly sourced from local farms</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
          <p className="text-sm text-gray-600">100% satisfaction guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
