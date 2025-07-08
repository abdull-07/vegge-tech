import jwt from 'jsonwebtoken';

const sellerAuth = async (req, res, next) => {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({ message: "Unauthorized, No token provided"})
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET)
        if (decoded.email === process.env.ADMIN_EMAIL) { 
            req.userEmail = decoded.email;
            next();
        } else {
            return res.status(401).json({message: "Unauthorized, Invalid token"})
        }
    } catch (error) {
        console.error("Authentication error:", error.message)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export default sellerAuth;