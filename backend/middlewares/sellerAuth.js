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
            req.userId = decoded.id || decoded.email; // Set userId for compatibility
            next();
        } else {
            console.log("Invalid seller email:", decoded.email, "Expected:", process.env.ADMIN_EMAIL);
            return res.status(401).json({message: "Unauthorized, Invalid token"})
        }
    } catch (error) {
        console.error("Authentication error:", error.message)
        return res.status(401).json({ message: "Authentication failed" })
    }
}

export default sellerAuth;