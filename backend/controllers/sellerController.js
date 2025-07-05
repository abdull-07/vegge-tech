import jwt from 'jsonwebtoken';

export const sellerLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Unauthorized, Invalid email OR password" });
    }

    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Set token as HTTP-only cookie
        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ message: "Seller Logged in Successfully", token });
    } catch (error) {
        console.error("Seller login error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// Check authenticated user
//  /api/seller/check-auth
export const checkAuthSeller = async (req, res) => {
    try {
        const { sellerToken } = req.cookies;
        if (!sellerToken) {
            return res.status(401).json({ message: "Unauthorized, No token provided" })
        }

        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET)
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ message: "Unauthorized, Invalid token" });
        }
        // No need to set req.userId
        return res.status(200).json({ user: { email: decoded.email } });

    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}



//  /api/seller/logout
export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
        })
        return res.status(200).json({ message: "Seller logged out successfully" });

    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
        
    }
}