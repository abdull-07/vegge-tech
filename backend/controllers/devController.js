import User from "../models/UserModel.js";

// Development-only controller to list verification tokens
// This should NEVER be used in production
export const listVerificationTokens = async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "This endpoint is not available in production" });
    }
    
    // Find users with verification tokens
    const users = await User.find({ 
      verificationToken: { $exists: true },
      isVerified: false
    }).select('name email verificationToken verificationExpires');
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No pending verification tokens found" });
    }
    
    // Format the response
    const formattedUsers = users.map(user => ({
      name: user.name,
      email: user.email,
      verificationToken: user.verificationToken,
      verificationExpires: user.verificationExpires,
      verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${user.verificationToken}`
    }));
    
    return res.status(200).json({ users: formattedUsers });
  } catch (error) {
    console.error("Dev controller error:", error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Development-only controller to manually verify a user
export const manuallyVerifyUser = async (req, res) => {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: "This endpoint is not available in production" });
    }
    
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();
    
    return res.status(200).json({ 
      message: "User manually verified successfully",
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error("Manual verification error:", error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};