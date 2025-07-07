import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Products.js';

// Add Products
export const addProduct = async (req, res) => {
    try {
        let productData = (req.body.productData)

        const images = req.files || []

        if (!images.length) {
      return res.status(400).json({ message: "No images uploaded" });
    }

        let imagesUrl = await Promise.all(
            images.map(async (i) => {
                const result = await cloudinary.uploader.upload(i.path, {
                    resource_type: "image"
                })
                return result.secure_url 
            })
        )

        await Product.create({...productData, image: imagesUrl})

        res.status(201).json({ message: "Product added successfully" });

    } catch (error) {
        console.error("Error in adding product:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get Products
export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({isAvailable: true}) // Fetch all products that are available
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error in fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    
}

// Get Single Products
export const getSingleProduct = async (req, res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        res.status(200).json({product})
    } catch (error) {
        console.error("Error in fetching single product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Change Product in Stock
export const changeStock = async (req, res) => {
    try {
        const {id, inStock} = req.body
        await Product.findByIdAndUpdate(id, {inStock})
        res.status(200).json({massage: "Stock Upated Successfully"})
    } catch (error) {
        console.error("Error in fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" })
    }
}