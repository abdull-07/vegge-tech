import React from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const ProductList = () => {
  const { products, axios, setProducts } = useAppContext();

  // Flatten all product arrays
  const allProducts = [
    ...(products.fruits || []),
    ...(products.vegetables || []),
    ...(products.bundles || []),
  ];

  const toggleStock = async (id, current) => {
    setProducts(prev => {
      const update = { ...prev };
      ["fruits", "vegetables", "bundles"].forEach(cat => {
        update[cat] = (update[cat] || []).map(p =>
          p._id === id ? { ...p, inStock: !current} : p
        );
      });
      return update;
    });

    try {
      await axios.patch("/api/product/stock", {id, inStock: !current })
      toast.success("Stock status saved")
    } catch (error) {
          setProducts(prev => { 
      const revert = { ...prev };
      ["fruits","vegetables", "bundles"].forEach(cat => {
        revert[cat] = (revert[cat] || []).map(p =>
          p._id === id ? { ...p, inStock: current } : p
        );
      });
      return revert;
    });
    toast.error(err.response?.data?.message || "Failed to save");
    }
  }

  return (
    <div className="flex-1 py-10 flex flex-col justify-between bg-background-light min-h-screen">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-xl font-semibold text-text">All Products</h2>

        <div className="flex flex-col items-center w-full overflow-hidden rounded-md bg-white shadow-sm">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-text text-sm text-left bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Product</th>
                <th className="px-4 py-3 font-semibold truncate">Category</th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">Selling Price</th>
                <th className="px-4 py-3 font-semibold truncate">In Stock</th>
              </tr>
            </thead>
            <tbody className="text-sm text-text-light bg-white">
              {allProducts.map((product) => (
                <tr key={product._id} className="border-t border-text-light/30 hover:bg-background-light/50 transition">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="rounded p-2">
                      <img src={product.imageUrl} alt="Product" className="w-16 h-16 object-contain rounded" />
                    </div>
                    <span className="truncate max-sm:hidden w-full">{product.name}</span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">Rs.{product.offerPrice}</td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked={product.inStock}
                        onClick={() => toggleStock(product._id, product.inStock)}
                      />
                      <div className="w-12 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ProductList;
