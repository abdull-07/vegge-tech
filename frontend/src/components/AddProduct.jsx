import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const [file, setFile] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const { products, axios } = useAppContext();

  const categories = ["Fruits", "Vegetables"];

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name,
        description: description.split('\n'),
        category,
        price,
        offerPrice,
      }

      const formData = new FormData()
      formData.append('productData', JSON.stringify(productData))
      if (file) {
        formData.append('images', file);
      }
      await axios.post('/api/product/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setName('')
      setDescription('')
      setCategory('')
      setPrice('')
      setOfferPrice('')
      setFile('')


      toast.success("Product added successfully")

    } catch (error) {
      toast.error("Failed to add product");
      console.error(error);
    }
  };

  return (
    <div className="py-10 flex flex-col justify-between bg-background-light min-h-screen">
      <form
        onSubmit={addProduct}
        className="bg-white md:p-10 p-4 space-y-5 w-full rounded shadow-sm mx-auto"
      >
        {/* Image Upload */}
        <div>
          <p className="text-base font-medium text-text">Product Image</p>
          <label htmlFor="image" className="block mt-2">
            <input
              accept="image/*"
              type="file"
              id="image"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
            <img
              className="max-w-24 cursor-pointer border border-text-light rounded"
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/uploadArea.png'
              }
              alt="uploadArea"
              width={100}
              height={100}
            />
          </label>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-text" htmlFor="product-name">Product Name</label>
          <input
            id="product-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here"
            className="outline-none py-2 px-3 rounded border border-text-light/30 text-text"
            required
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-text" htmlFor="product-description">Product Description</label>
          <textarea
            id="product-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-none py-2 px-3 rounded border border-text-light/30 text-text resize-none"
            placeholder="Type here"
          />
        </div>

        {/* Category */}
        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="text-base font-medium text-text" htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none py-2 px-3 rounded border border-text-light/30 text-text"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>


        {/* Prices */}
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium text-text" htmlFor="product-price">Product Price</label>
            <input
              id="product-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-text-light/30 text-text"
              required
            />
          </div>
          <div className="flex-1 flex flex-col gap-1 w-32">
            <label className="text-base font-medium text-text" htmlFor="offer-price">Offer Price</label>
            <input
              id="offer-price"
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="0"
              className="outline-none py-2 px-3 rounded border border-text-light/30 text-text"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-secondary-hover transition">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
