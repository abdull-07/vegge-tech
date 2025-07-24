import { sendVerificationEmail } from "../utils/emailService.js";
import User from "../models/UserModel.js";

// Test email sending functionality
export const testEmailService = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Send a test email
    await sendVerificationEmail(
      email,
      "Test User",
      "test-verification-token-123456"
    );
    
    return res.status(200).json({ 
      message: "Test email sent successfully! Please check your inbox.",
      sentTo: email
    });
  } catch (error) {
    console.error("Test email error:", error);
    return res.status(500).json({ 
      message: "Failed to send test email", 
      error: error.message 
    });
  }
};

// Debug user verification status
export const debugUserStatus = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        hasVerificationToken: !!user.verificationToken,
        verificationTokenLength: user.verificationToken ? user.verificationToken.length : 0,
        verificationExpires: user.verificationExpires,
        tokenExpired: user.verificationExpires ? new Date(user.verificationExpires) < new Date() : false
      }
    });
  } catch (error) {
    console.error("Debug user status error:", error);
    return res.status(500).json({ 
      message: "Failed to get user status", 
      error: error.message 
    });
  }
};

// Generate new verification token for user
export const generateVerificationToken = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }
    
    // Generate new verification token
    const crypto = await import('crypto');
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valid for 24 hours
    
    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationExpires = tokenExpiry;
    await user.save();
    
    // Send verification email
    try {
      await sendVerificationEmail(
        user.email,
        user.name,
        verificationToken
      );
      
      return res.status(200).json({
        message: "New verification token generated and email sent successfully",
        verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`
      });
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(200).json({
        message: "Verification token generated but email sending failed",
        verificationLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email/${verificationToken}`,
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error("Generate verification token error:", error);
    return res.status(500).json({ 
      message: "Failed to generate verification token", 
      error: error.message 
    });
  }
};