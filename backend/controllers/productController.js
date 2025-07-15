import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Products.js';

// Add Products
export const addProduct = async (req, res) => {
    try {
        let productData = req.body.productData;

        if (typeof productData === 'string') {
            productData = JSON.parse(productData);
        }
        const file = req.file; // ✅ for single image

        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Upload image to Cloudinary
        let imagesUrl = "";
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "image"
            });
            imagesUrl = result.secure_url;
        }

        // Create product

        await Product.create({ ...productData, sellerId: req.userId, imageUrl: imagesUrl });

        res.status(201).json({ message: "Product added successfully" });

    } catch (error) {
        console.error("Error in adding product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get Products
export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({isAvailable: true}) // Fetch all products that are available
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ products });
    } catch (error) {
        console.error("Error in fetching products:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// Get Single Products
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)
        res.status(200).json({ product })
    } catch (error) {
        console.error("Error in fetching single product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Change Product in Stock
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body
        if (!id) return res.status(400).json({ message: "Missing product id" })
        await Product.findByIdAndUpdate(id, { inStock })
        res.status(200).json({ massage: "Stock Upated Successfully" })
    } catch (error) {
        console.error("Error in fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}