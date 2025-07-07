import User from "../models/UserModel.js"

// update cart data
export const updateCart = async (req, res) => {
    try {
        const userId = req.userId; // from JWT middleware
    const { cartItem } = req.body;

    if (!Array.isArray(cartItem)) {
        res.status(400).json({message:"Invalid cart format"})
    }

    await User.findByIdAndUpdate(userId, {cartItem})
    res.status(200).json({message:"Cart Updated."})

    } catch (error) {
        console.error("Error in Updating Cart:", error)
        res.status(500).json({ message: "Internal Server Error" });
    }
}