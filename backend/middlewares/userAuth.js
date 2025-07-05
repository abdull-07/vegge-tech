import jwt from 'jsonwebtoken';
import User from "../models/UserModel.js"

const userAuth = async (req, res, next) => {
    const token = req.cookies.token   

    if(!token){return res.status(401).json ({ message: "Unauthorized, No token provided"})}

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (decoded) { req.userId = decoded.id } // Attach user ID to request body
        else {return res.status(401).json({message: "Unauthorized, Invalid token"})}
        next()

    } catch (error) {
        console.error("Authentication error:", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default userAuth;