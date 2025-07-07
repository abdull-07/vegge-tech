import Address from "../models/AddressModel.js";

// /api/address/add
export const addAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.userId; // ✅ Use from middleware
        await Address.create({ ...address, userId })
        res.status(200).json({ message: "Address Updated." })
    } catch (error) {
        console.error("Error in adding product:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// /api/address/get
export const getAddress = async (req, res) => {
    try {
        const userId = req.userId; // ✅ Use from middleware
        const addresses = await Address.find({ userId })
        res.status(200).json({ addresses })
    } catch (error) {
        console.error("Error in adding product:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}