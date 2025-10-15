import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Products.js';

// Add Products
export const addProduct = async (req, res) => {
    try {
        let productData = req.body.productData;

        if (typeof productData === 'string') {
            productData = JSON.parse(productData);
        }

        // Validate required fields
        if (!productData.name || !productData.name.trim()) {
            return res.status(400).json({ message: "Product name is required" });
        }
        if (!productData.description || productData.description.length === 0) {
            return res.status(400).json({ message: "Product description is required" });
        }
        if (!productData.category) {
            return res.status(400).json({ message: "Product category is required" });
        }
        if (!productData.price || productData.price <= 0) {
            return res.status(400).json({ message: "Valid product price is required" });
        }
        if (!productData.offerPrice || productData.offerPrice <= 0) {
            return res.status(400).json({ message: "Valid offer price is required" });
        }
        
        const file = req.file; // ✅ for single image

        if (!file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        // Upload image to Cloudinary using buffer (memory storage)
        let imagesUrl = "";
        if (req.file && req.file.buffer) {
            // Convert buffer to base64 for Cloudinary upload
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            
            const result = await cloudinary.uploader.upload(dataURI, {
                resource_type: "image",
                folder: "vegge-tech-products", // Optional: organize uploads in folders
            });
            imagesUrl = result.secure_url;
        }

        if (!imagesUrl) {
            return res.status(400).json({ message: "Failed to upload image to cloud storage" });
        }

        // Create product
        const newProduct = await Product.create({ 
            ...productData, 
            sellerId: req.userId, // Use userId from sellerAuth middleware (can be ObjectId or email)
            imageUrl: imagesUrl 
        });

        console.log("Product created successfully:", newProduct._id);

        res.status(201).json({ 
            message: "Product added successfully",
            product: newProduct,
            imageUrl: imagesUrl 
        });

    } catch (error) {
        console.error("Error in adding product:", error);
        
        // Handle specific MongoDB validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Product with this name already exists" 
            });
        }

        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
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