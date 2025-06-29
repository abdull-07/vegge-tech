import { useState } from "react";
import ProductCard from "./ProductCard";
import { productsData } from "../assets/productsdata";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("fruits");
  const products = productsData[activeTab]?.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["fruits", "vegetables"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full font-semibold transition capitalize ${activeTab === tab
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 ">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;
