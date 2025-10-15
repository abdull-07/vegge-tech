import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Products.js';

// Test endpoint to check if everything is working
export const testProductEndpoint = async (req, res) => {
    try {
        console.log("Test endpoint called");
        console.log("Environment check:", {
            NODE_ENV: process.env.NODE_ENV,
            CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
            MONGO_URL: !!process.env.MONGO_URL,
            JWT_SECRET: !!process.env.JWT_SECRET
        });
        
        // Test database connection
        const productCount = await Product.countDocuments();
        console.log("Database connection OK, product count:", productCount);
        
        // Test Cloudinary config
        const cloudinaryConfig = cloudinary.config();
        console.log("Cloudinary config:", {
            cloud_name: cloudinaryConfig.cloud_name,
            api_key: !!cloudinaryConfig.api_key
        });
        
        res.status(200).json({
            message: "Test endpoint working",
            environment: process.env.NODE_ENV,
            database: "Connected",
            cloudinary: "Configured",
            productCount
        });
    } catch (error) {
        console.error("Test endpoint error:", error);
        res.status(500).json({
            message: "Test failed",
            error: error.message
        });
    }
};

// Add Products
export const addProduct = async (req, res) => {
    console.log("=== ADD PRODUCT REQUEST START ===");
    console.log("Request body keys:", Object.keys(req.body));
    console.log("Request file:", req.file ? "File present" : "No file");
    console.log("User ID from auth:", req.userId);
    console.log("User Email from auth:", req.userEmail);
    
    try {
        let productData = req.body.productData;
        console.log("Raw productData:", productData);

        if (typeof productData === 'string') {
            productData = JSON.parse(productData);
            console.log("Parsed productData:", productData);
        }

        // Validate required fields
        if (!productData.name || !productData.name.trim()) {
            console.log("Validation failed: Product name missing");
            return res.status(400).json({ message: "Product name is required" });
        }
        if (!productData.description || productData.description.length === 0) {
            console.log("Validation failed: Product description missing");
            return res.status(400).json({ message: "Product description is required" });
        }
        if (!productData.category) {
            console.log("Validation failed: Product category missing");
            return res.status(400).json({ message: "Product category is required" });
        }
        if (!productData.price || productData.price <= 0) {
            console.log("Validation failed: Invalid price:", productData.price);
            return res.status(400).json({ message: "Valid product price is required" });
        }
        if (!productData.offerPrice || productData.offerPrice <= 0) {
            console.log("Validation failed: Invalid offer price:", productData.offerPrice);
            return res.status(400).json({ message: "Valid offer price is required" });
        }
        
        const file = req.file;
        console.log("File details:", file ? {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            hasBuffer: !!file.buffer
        } : "No file");

        if (!file) {
            console.log("Validation failed: No file uploaded");
            return res.status(400).json({ message: "Product image is required" });
        }

        console.log("Starting Cloudinary upload...");
        console.log("Cloudinary config check:", {
            cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
            api_key: !!process.env.CLOUDINARY_API_KEY,
            api_secret: !!process.env.CLOUDINARY_API_SECRET
        });

        // Upload image to Cloudinary using buffer (memory storage)
        let imagesUrl = "";
        if (req.file && req.file.buffer) {
            try {
                // Convert buffer to base64 for Cloudinary upload
                const b64 = Buffer.from(req.file.buffer).toString("base64");
                const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
                console.log("DataURI created, length:", dataURI.length);
                
                const result = await cloudinary.uploader.upload(dataURI, {
                    resource_type: "image",
                    folder: "vegge-tech-products",
                });
                imagesUrl = result.secure_url;
                console.log("Cloudinary upload successful:", imagesUrl);
            } catch (cloudinaryError) {
                console.error("Cloudinary upload error:", cloudinaryError);
                return res.status(500).json({ 
                    message: "Failed to upload image to cloud storage",
                    error: cloudinaryError.message 
                });
            }
        }

        if (!imagesUrl) {
            console.log("Image upload failed: No URL returned");
            return res.status(400).json({ message: "Failed to upload image to cloud storage" });
        }

        console.log("Creating product in database...");
        const productToCreate = {
            ...productData, 
            sellerId: req.userId,
            imageUrl: imagesUrl 
        };
        console.log("Product data to create:", productToCreate);

        // Create product
        const newProduct = await Product.create(productToCreate);
        console.log("Product created successfully:", newProduct._id);

        res.status(201).json({ 
            message: "Product added successfully",
            product: newProduct,
            imageUrl: imagesUrl 
        });

    } catch (error) {
        console.error("=== ADD PRODUCT ERROR ===");
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        // Handle specific MongoDB validation errors
        if (error.name === 'ValidationError') {
            console.log("MongoDB validation error details:", error.errors);
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: validationErrors 
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            console.log("Duplicate key error:", error.keyPattern);
            return res.status(400).json({ 
                message: "Product with this name already exists" 
            });
        }

        // Handle JSON parsing errors
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
            console.log("JSON parsing error");
            return res.status(400).json({ 
                message: "Invalid product data format" 
            });
        }

        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message,
            errorType: error.name
        });
    } finally {
        console.log("=== ADD PRODUCT REQUEST END ===");
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